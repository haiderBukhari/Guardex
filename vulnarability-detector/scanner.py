import os
import json
import re
import requests
from google import generativeai as genai


def split_js_code(js_code, max_chars=82000):
    chunks = []
    current = ""

    for word in js_code.split(" "):  # Split on spaces
        if len(current) + len(word) + 1 > max_chars:
            chunks.append(current.strip())
            current = ""
        current += word + " "

    if current.strip():
        chunks.append(current.strip())

    return chunks


def create_prompt(chunk):
    return f"""
        You are a senior web security auditor. Your job is to analyze the JavaScript code below and return a list of **real, exploitable security vulnerabilities** that developers must fix immediately.

        ---

        🎯 Focus on actionable and exploitable vulnerabilities, including:

        - ✅ **Secrets/API Key Leaks** (Firebase, Stripe, OpenAI, GitHub, JWTs, etc.)
        - ✅ **Firebase Full Configuration Exposure**:
          - Report if a full Firebase config object is exposed in the code.
          - Includes keys such as `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, and optionally `measurementId`.
          - Report as a single vulnerability with the full JSON-like config object under `leaked_value`.
        - ✅ **Token exposure** in `localStorage` / `sessionStorage`
        - ✅ **Cloudinary Upload Abuse** (`upload_preset`, full link, hardcoded endpoints)
        - ✅ **Hardcoded WebSocket or API URLs** to backend servers
        - ✅ **Use of dangerous JS APIs**:
        - ✅ **Logic flaws or insecure access**:
          - Upload endpoints without auth
          - Internal APIs directly accessible
        - ✅ OWASP Top 10 issues: XSS, CSRF, SSRF, SQLi, Command Injection, etc.

        ---

        🚫 DO NOT REPORT:

        - ❌ Standard, known-safe URLs such as:
          - `http://www.w3.org/2000/svg`
          - `http://www.w3.org/1999/xhtml`
          - `http://www.w3.org/1998/Math/MathML`
          - `http://schemas.xmlsoap.org/wsdl/`
        - ❌ Theoretical vulnerabilities or suspicious patterns with no confirmed exploit
        - ❌ Placeholder values (e.g., `"..."`, `"REDACTED"`, `"null"`, `"undefined"`)
        - ❌ Publicly known and safe URLs eg font, w3, schemas, and docs.
 
        ---

        📍 For each vulnerability found, return a structured JSON object like:

        ```json
        {{
          "vulnerability_type": "e.g. Firebase Config Leak / Token Exposure / XSS",
          "name": "Short title of the issue",
          "description": "Explain the security flaw in 1–2 lines",
          "leaked_value": "Exact hardcoded value (e.g., token, key, config object) or null",
          "recommendation": "Clear, actionable fix recommendation",
          "severity": "low / medium / high / critical",
          "file_url": "N/A"
        }}
        ```
        ---

        Analyze:
        {chunk}
    """


class GeminiPool:
    def __init__(self, keys, rotation_limit=3):
        self.keys = keys
        self.rotation_limit = rotation_limit
        self.current_index = 0
        self.counter = 0
        self.model = None
        self.configure_model()

    def configure_model(self):
        genai.configure(api_key=self.keys[self.current_index])
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def rotate_key(self):
        self.counter = 0
        self.current_index = (self.current_index + 1) % len(self.keys)
        self.configure_model()

    def get_model(self):
        if self.counter >= self.rotation_limit:
            self.rotate_key()
        self.counter += 1
        return self.model


def extract_json_from_response(result_str):
    try:
        match = re.search(r"```json\s*([\s\S]+?)```", result_str)
        json_str = match.group(1) if match else result_str.strip()

        try:
            data = json.loads(json_str)
            return data if isinstance(data, list) else [data]
        except:
            fallback_match = re.search(r"\[\s*{[\s\S]+?}\s*]", json_str)
            return json.loads(fallback_match.group(0)) if fallback_match else []

    except Exception as e:
        print(f"JSON parse error: {e}")
        return []


def fetch_js_with_fallback(url, timeout=10):
    try:
        response = requests.get(url, timeout=timeout)
        if response.status_code == 200:
            return response.text
    except:
        if url.startswith("http://"):
            try:
                fallback_url = url.replace("http://", "https://", 1)
                response = requests.get(fallback_url, timeout=timeout)
                if response.status_code == 200:
                    return response.text
            except Exception as e:
                print(f"❌ Fallback HTTPS also failed: {e}")
    raise Exception(f"❌ Could not fetch JS file: {url}")


def more_aggressive_filter(js_code):
    patterns = [
        r"[\"'][^\"']+[\"']",
        r"\b(apiKey|secret|token|auth|key|id)\b",
        r"[a-zA-Z0-9]{10,}",
        r"(http:\/\/|https:\/\/|ws:\/\/|wss:\/\/)[^\"']+",
        r"dpl_[a-zA-Z0-9]+",
    ]
    relevant_code = ""
    seen_lines = set()
    for line in js_code.splitlines():
        for pattern in patterns:
            if re.search(pattern, line):
                if line not in seen_lines:
                    relevant_code += line + "\n"
                    seen_lines.add(line)
                break
    return relevant_code.strip()


def scan_all_js(js_urls, gemini_keys):
    pool = GeminiPool(gemini_keys)
    final_results = []

    unique_urls = list(set(js_urls))

    for js_url in unique_urls:
        try:
            js_code = fetch_js_with_fallback(js_url)
            filtered_code = more_aggressive_filter(js_code)
            chunks = split_js_code(filtered_code)  # Split the filtered code

            total_chunks = len(chunks)
            print(f"\n📁 Scanning {js_url} — {total_chunks} chunk(s) (Filtered)")

            for i, chunk in enumerate(chunks):
                percent_complete = int((i + 1) / total_chunks * 100)
                print(f"🔍 Scanning chunk {i + 1}/{total_chunks} ({percent_complete}%)")

                retries = 0
                while retries < len(gemini_keys):
                    try:
                        model = pool.get_model()
                        result = model.generate_content(create_prompt(chunk)).text
                        parsed = extract_json_from_response(result)
                        for entry in parsed:
                            entry["file_url"] = js_url
                        final_results.extend(parsed)
                        break
                    except Exception as e:
                        print(f"⚠️ Gemini call failed: {e}")
                        pool.rotate_key()
                        retries += 1

        except Exception as e:
            print(f"❌ Failed to fetch or scan {js_url}: {e}")
            continue

    return final_results
