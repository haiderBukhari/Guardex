import json
import re
from google import generativeai as genai

GEMINI_KEY = "AIzaSyApYySLz4_7zxg34jIT9ruKzdiL974jjFI"
BATCH_SIZE = 20

def summarize_vulnerabilities(report_data):
    def create_prompt(data):
        return f"""
        You are an expert security analyst.

        You will be given a JSON array of vulnerability objects. Each object contains:
        - vulnerability_type
        - name
        - description
        - leaked_value
        - recommendation
        - severity

        Your task:

        🔐 Deduplicate and Merge:
        - Group findings only if they originate from the **same service/tool/provider**, such as:
          - Firebase
          - OpenAI
          - Stripe
          - Google Cloud
          - Cloudinary
          - GitHub
          - Vercel
          - Custom backend endpoints, or any already here, etc..
        - **DO NOT** group multiple unrelated services/tools into the same entry.
          - For example: Firebase keys should stay together, OpenAI keys separately.
        - Keep `leaked_value` as an array of valid strings only.
        - DO NOT flatten or concatenate different leaked values into a single string.
        - Be specific. One vulnerability per vendor/tool per context.
        - Write the recommendation and description in detail to ensure it provides complete understanding.

        Format your entire response strictly as valid JSON array only between these markers.
        Do NOT include markdown, explanation, comments, or other content outside the JSON.

        Return only this:

        ###JSONSTART
        [
          {{ ... }}
        ]
        ###JSONEND

        Here is the data:
        {json.dumps(data, indent=2)}
        """

    def extract_cleaned_json(text):
        try:
            match = re.search(r"\[\s*{.*?}\s*]", text, re.DOTALL)
            return json.loads(match.group(0)) if match else []
        except Exception as e:
            print(f"⚠️ Failed to parse response: {e}")
            return []

    def batch_chunks(data, size):
        for i in range(0, len(data), size):
            yield data[i:i + size]

    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")

    final_result = []
    batches = list(batch_chunks(report_data, BATCH_SIZE))

    for i, batch in enumerate(batches):
        print(f"🧪 Processing batch {i + 1}/{len(batches)}")
        prompt = create_prompt(batch)
        try:
            response = model.generate_content(prompt)
            print("response ", response)
            batch_result = extract_cleaned_json(response.text)
            print("batch_result ", batch_result)
            if batch_result:
                final_result.extend(batch_result)
        except Exception as e:
            print(f"Error in batch {i + 1}: {e}")
            continue
    
    print("end...")
    return final_result