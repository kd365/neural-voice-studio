# In the backend directory
from flask import Flask, jsonify, request
from flask_cors import CORS
import boto3
import base64
import os

app = Flask(__name__)
CORS(app)

# Initialize Polly client
polly_client = boto3.client('polly', region_name='us-east-1')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "flask-polly-api"}), 200

@app.route('/api/generate', methods=['POST'])
def generate_speech():
    data = request.json
    text = data.get('text', 'Hello from Flask API on ECS')
    voice_id = data.get('voiceId', 'Joanna')

    try:
        # Call AWS Polly
        response = polly_client.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=voice_id,
            Engine='neural'
        )

        # Read audio stream
        audio_data = response['AudioStream'].read()

        # Encode to base64 for JSON response
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')

        return jsonify({
            'audioData': audio_base64,
            'message': 'Audio generated successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voices', methods=['GET'])
def get_voices():
    return jsonify({
        'voices': ['Joanna', 'Matthew', 'Amy', 'Brian', 'Emma', 'Justin']
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
