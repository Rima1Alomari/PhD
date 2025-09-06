from flask import Flask, request, jsonify, send_from_directory, url_for
from gtts import gTTS
import os
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create directory for audio files
AUDIO_FOLDER = "audio_files"
os.makedirs(AUDIO_FOLDER, exist_ok=True)

# Cache to prevent regenerating the same speech
speech_cache = {}

@app.route("/convert", methods=["POST"])
def convert_text_to_speech():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Text parameter is required"}), 400

        text = data.get("text")
        # Get the requested language; default to Arabic ("ar")
        lang = data.get("language", "ar")
        
        # Use a composite key for caching (text and language)
        cache_key = f"{text}_{lang}"
        if cache_key in speech_cache and os.path.exists(speech_cache[cache_key]):
            file_url = url_for('serve_audio', filename=os.path.basename(speech_cache[cache_key]), _external=True)
            return jsonify({"file_url": file_url, "cached": True})
        
        # Generate unique filename
        filename = f"speech_{uuid.uuid4().hex}.mp3"
        file_path = os.path.join(AUDIO_FOLDER, filename)
        
        # Convert text to speech using the selected language
        tts = gTTS(text=text, lang=lang, slow=False)
        tts.save(file_path)
        
        # Cache the file path using the composite key
        speech_cache[cache_key] = file_path
        
        # Return URL for the audio file
        file_url = url_for('serve_audio', filename=filename, _external=True)
        return jsonify({"file_url": file_url, "cached": False})
    except Exception as e:
        print(f"Error in text-to-speech conversion: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/audio_files/<filename>')
def serve_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)

if __name__ == "__main__":
    print("Starting text-to-speech server on port 5003...")
    app.run(debug=True, host="0.0.0.0", port=5003)
