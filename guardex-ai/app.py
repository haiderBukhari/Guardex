from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import requests
import base64
import json


app = Flask(__name__)
CORS(app) 

# API Keys
DEEPGRAM_API_KEY = ""
OPENAI_API_KEY = ""
client = openai.OpenAI(api_key=OPENAI_API_KEY)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "✅ Voice Assistant API is up and running!"}), 200


def deepgram_tts(text, api_key):
    url = "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Token {api_key}"
    }
    payload = {
        "text": text
    }

    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code != 200:
        return None, response.text

    audio_base64 = base64.b64encode(response.content).decode("utf-8")
    return audio_base64, None

@app.route("/api/voice-agent", methods=["POST"])
def handle_audio():
    if "audio" not in request.files:
        return jsonify({"error": "Missing audio file"}), 400

    if not request.form.get("vulnerabilities"):
        return jsonify({"error": "Missing vulnerability data"}), 400

    try:
        # Parse vulnerability JSON string from form-data
        vulnerabilities_json = json.loads(request.form.get("vulnerabilities"))
    except Exception as e:
        return jsonify({"error": "Invalid vulnerability JSON"}), 400

    audio_file = request.files["audio"]
    audio_bytes = audio_file.read()

    transcript_resp = requests.post(
        "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true",
        headers={
            "Authorization": f"Token {DEEPGRAM_API_KEY}",
            "Content-Type": audio_file.mimetype
        },
        data=audio_bytes
    )

    try:
        transcript_resp.raise_for_status()
    except requests.exceptions.RequestException:
        return jsonify({
            "error": "Deepgram failed to process audio",
            "details": transcript_resp.text
        }), 500

    transcription = (
        transcript_resp.json()
        .get("results", {})
        .get("channels", [{}])[0]
        .get("alternatives", [{}])[0]
        .get("transcript", "")
    )

    if not transcription:
        return jsonify({"error": "Could not transcribe audio"}), 500

    # Convert vulnerability data to text for the prompt
    vuln_text = "\n\n".join([
        f"- {v.get('name')} ({v.get('severity')}): {v.get('description')}"
        for v in vulnerabilities_json
    ])

    prompt = f"""
You are a security expert AI assistant. The user asked: "{transcription}"

Based only on the vulnerabilities below, give a clear and concise answer. Focus on what is relevant to the question. Be short under 970 characters very strictly, accurate, and friendly.

🎯 Here’s what to do:
1. If the user greets you (e.g., "Hi", "Hello", "Hey"), just reply politely like:
   - "Hi there! I can help you understand any vulnerabilities. Ask me anything."

2. If the user asks a general question, respond briefly and helpfully.

3. If the user asks about a specific security vulnerability, give a direct and accurate answer — but ONLY based on the vulnerabilities provided below.

💡 NEVER invent any information. If unsure or the topic is not covered in the vulnerabilities, say:  
   - "Sorry, I couldn't find any matching vulnerability in the scan data."

VULNERABILITY DATA:
{vuln_text}
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": transcription}
        ],
        max_tokens=200,
        temperature=0.5
    )

    reply_text = response.choices[0].message.content

    audio_base64, error = deepgram_tts(reply_text, DEEPGRAM_API_KEY)
    if error:
        return jsonify({"error": "TTS failed", "details": error}), 500

    return jsonify({
        "transcription": transcription,
        "response_text": reply_text,
        "response_audio_base64": audio_base64
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
