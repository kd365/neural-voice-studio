const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function generateSpeech(text, voiceId = "Joanna") {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceId })
  });

  if (!response.ok) {
    throw new Error('Generation failed');
  }

  const data = await response.json();

  // Convert base64 back to Uint8Array
  const binaryString = atob(data.audioData);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

export const VOICES = [
  { id: "Joanna", name: "Joanna (US Female)", engine: "neural" },
  { id: "Matthew", name: "Matthew (US Male)", engine: "neural" },
  { id: "Amy", name: "Amy (British Female)", engine: "neural" },
  { id: "Brian", name: "Brian (British Male)", engine: "neural" },
  { id: "Emma", name: "Emma (British Female)", engine: "neural" },
  { id: "Justin", name: "Justin (US Male, Child)", engine: "neural" },
];
