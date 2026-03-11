export function createAudioBlob(audioData) {
  // Create a Blob (binary large object) from our Uint8Array
  return new Blob([audioData], { type: "audio/mpeg" });
}

export function createAudioUrl(blob) {
  // Create a temporary URL that points to this blob
  // Important: these URLs need to be revoked to prevent memory leaks
  return URL.createObjectURL(blob);
}

export function downloadAudio(blob, filename = "speech.mp3") {
  const url = createAudioUrl(blob);
  
  // Programmatically trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the temporary URL
  URL.revokeObjectURL(url);
}

// Validation lets us ensure there is actually text to synthesize and that its not too long-- otherwise, we may risk a timed out api call
export function validateText(text) {
  if (!text?.trim()) {
    return { valid: false, error: "Enter some text first" };
  }
  if (text.length > 3000) {
    return { valid: false, error: "Text too long (max 3000 characters)" };
  }
  return { valid: true };
}