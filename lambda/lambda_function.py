import json
import boto3
import base64

polly_client = boto3.client('polly', region_name='us-east-1')

ALLOWED_VOICES = {'Joanna', 'Matthew', 'Amy', 'Brian', 'Emma', 'Justin'}

def lambda_handler(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    # Handle CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    try:
        body = json.loads(event.get('body', '{}'))
        text = body.get('text', '').strip()
        voice_id = body.get('voiceId', 'Joanna')

        if not text:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Text is required'}),
            }

        if len(text) > 3000:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Text exceeds 3000 character limit'}),
            }

        if voice_id not in ALLOWED_VOICES:
            voice_id = 'Joanna'

        response = polly_client.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=voice_id,
            Engine='neural',
        )

        audio_data = response['AudioStream'].read()
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'audioData': audio_base64,
                'message': 'Audio generated successfully',
            }),
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
        }
