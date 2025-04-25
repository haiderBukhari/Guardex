from flask import Flask, request
from flask_socketio import SocketIO, emit
import httpx
from jscrawler import JSFileCrawler
from summarize import summarize_vulnerabilities
from scanner import (
    GeminiPool,
    fetch_js_with_fallback,
    more_aggressive_filter,
    split_js_code,
    create_prompt,
    extract_json_from_response,
)
from concurrent.futures import ThreadPoolExecutor, as_completed
from supabase import create_client, Client
import os
import json
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# Supabase client
supabase_url = ""
supabase_key = ""
supabase: Client = create_client(supabase_url, supabase_key)

GEMINI_KEYS = [
]

@socketio.on("start_scan")
def handle_start_scan(data):
    base_url = data.get("url")
    user_id = data.get("user_id")
    sid = request.sid  # Capture session ID

    if not base_url or not user_id:
        emit("scan_update", {"message": "❌ Missing URL or user_id."}, to=sid)
        return

    emit("scan_update", {"message": f"🌐 Starting scan for {base_url}"}, to=sid)

    try:
        crawler = JSFileCrawler(base_url, max_depth=4)
        js_files = sorted(set(crawler.crawl()))

        emit("scan_update", {"message": f"🔎 Finding files, found: {len(js_files)} files"}, to=sid)
        emit("scan_update", {"message": "🛡️ Finding Vulnerabilities..."}, to=sid)

        socketio.start_background_task(process_scan_and_summarize, js_files, base_url, user_id, sid)
    except Exception as e:
        emit("scan_update", {"message": f"❌ Error during crawl: {e}"}, to=sid)


def process_scan_and_summarize(js_files, base_url, user_id, sid):
    try:
        payload = {
            "website_link": base_url,
            "user_id": user_id,
            "scan_complete": False
        }

        print("Inserting scan record:", payload)

        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

        response = httpx.post(f"{supabase_url}/rest/v1/website_scans", headers=headers, json=payload)

        if response.status_code != 201:
            socketio.emit("scan_update", {"message": f"❌ Supabase insert failed: {response.text}"}, to=sid)
            return

        scan_id = response.json()[0]["id"]
        socketio.emit("scan_update", {"message": "JS scanning complete. Now summarizing..."}, to=sid)

        socketio.start_background_task(scan_and_process_files, js_files, scan_id, sid)

    except Exception as e:
        print("DB Insert or Summary Error:", e)
        socketio.emit("scan_update", {"message": f"❌ Error in DB or summarization: {e}"}, to=sid)


def scan_and_process_files(js_files, scan_id, sid):
    print("🔥 scan_and_process_files started with", len(js_files), "files")
    final_results = []
    total_files = len(js_files)

    try:
        for idx, js_url in enumerate(js_files):
            print(f"🌐 Fetching {js_url}")
            js_code = fetch_js_with_fallback(js_url)
            filtered_code = more_aggressive_filter(js_code)
            chunks = split_js_code(filtered_code)

            socketio.emit(
                "scan_update",
                {"message": f"📄 Scanning file {idx + 1}/{total_files} — {len(chunks)} chunk(s)"},
                to=sid
            )

            futures = []
            with ThreadPoolExecutor(max_workers=4) as executor:
                for i, chunk in enumerate(chunks):
                    futures.append(
                        executor.submit(process_chunk, chunk, js_url, i, len(chunks), sid)
                    )

                for future in as_completed(futures):
                    try:
                        result = future.result()
                        final_results.extend(result)
                    except Exception as e:
                        print(f"Future failed: {e}")
                        socketio.emit("scan_update", {"message": f"Error processing chunk: {e}"}, to=sid)

        socketio.emit("scan_update", {"message": "Summarizing complete!"}, to=sid)

        summarized_result = summarize_vulnerabilities(final_results)

        socketio.emit("scan_complete", summarized_result, to=sid)

        threading.Thread(target=update_scan_record, args=(scan_id, summarized_result)).start()

    except Exception as e:
        print(f"Error in processing files: {e}")
        socketio.emit("scan_update", {"message": f"Error in processing: {e}"}, to=sid)


def update_scan_record(scan_id, final_results):
    try:
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

        response = httpx.patch(
            f"{supabase_url}/rest/v1/website_scans?id=eq.{scan_id}",
            headers=headers,
            json={
                "vulnerabilities": final_results,
                "scan_complete": True
            }
        )
    except Exception as e:
        print("Error updating scan record:", e)


def process_chunk(chunk, js_url, chunk_index, total_chunks, sid):
    socketio.emit(
        "scan_update",
        {"message": f"🧩 Scanning chunk {chunk_index + 1}/{total_chunks}"},
        to=sid
    )
    retries = 0
    while retries < len(GEMINI_KEYS):
        try:
            model = GeminiPool(GEMINI_KEYS).get_model()
            result = model.generate_content(create_prompt(chunk)).text
            parsed = extract_json_from_response(result)
            for entry in parsed:
                entry["file_url"] = js_url
            return parsed
        except Exception as e:
            print(f"⚠️ Error in chunk {chunk_index + 1} of {js_url}: {e}")
            GeminiPool(GEMINI_KEYS).rotate_key()
            retries += 1
    return []


@app.route("/")
def home():
    return "🔌 SocketIO Server Running!"


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
