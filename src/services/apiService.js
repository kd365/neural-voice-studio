const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MAX_CALLS = 3;
const STORAGE_KEY = 'nvs_usage_count';

function isUnlimited() {
  const params = new URLSearchParams(window.location.search);
  return params.get('key') === 'UsageMetricsRock3567!';
}

export function getRemainingCalls() {
  if (isUnlimited()) return Infinity;
  const used = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  return MAX_CALLS - used;
}

function incrementUsage() {
  if (isUnlimited()) return;
  const used = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  localStorage.setItem(STORAGE_KEY, String(used + 1));
}

export async function generateSpeech(text, voiceId = "Joanna") {
  if (getRemainingCalls() <= 0) {
    throw new Error('Demo limit reached (3 of 3 generations used). This is a portfolio demo with limited usage.');
  }

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

  incrementUsage();
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
