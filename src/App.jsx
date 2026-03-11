import { useState } from "react";
import { Volume2 } from "lucide-react";
import AudioPlayer from "./components/AudioPlayer";
import { generateSpeech, VOICES } from "./services/apiService";
import { validateText } from "./utils/audioUtils";

export default function App() {
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState("Joanna");
  const [audioData, setAudioData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    const validation = validateText(text);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const audio = await generateSpeech(text, voiceId);
      setAudioData(audio);
    } catch (err) {
      setError(err.message);
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", display: "flex", flexDirection: "column" }}>
      <header style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "2rem"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "1.75rem" }}>
            <Volume2 size={32} />
            Neural Voice Studio
          </h1>
          <p style={{ margin: "0.25rem 0 0 0", opacity: 0.85, fontSize: "0.9rem" }}>
            AWS Polly Neural Text-to-Speech
          </p>
        </div>
      </header>

      <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem", flex: 1, width: "100%" }}>
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
        }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
              Text to speak:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              rows={6}
              style={{
                width: "100%",
                padding: "1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
              {text.length} / 3000 characters
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
              Voice:
            </label>
            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                background: "white"
              }}
            >
              {VOICES.map(voice => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              color: "#dc2626"
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            style={{
              width: "100%",
              background: isGenerating || !text.trim()
                ? "#d1d5db"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: isGenerating || !text.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <Volume2 size={20} />
            {isGenerating ? "Generating..." : "Generate Speech"}
          </button>

          {audioData && <AudioPlayer audioData={audioData} voiceId={voiceId} />}
        </div>
      </main>

      <footer style={{
        borderTop: "1px solid #e5e7eb",
        background: "white",
        padding: "1rem",
        textAlign: "center"
      }}>
        <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
          Built with React, Flask &amp; AWS Polly
          {" \u00b7 "}
          <a
            href="https://github.com/kd365/neural-voice-studio"
            style={{ color: "#667eea", textDecoration: "none" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source on GitHub
          </a>
          {" \u00b7 "}
          <a
            href="https://khilldata.com"
            style={{ color: "#667eea", textDecoration: "none" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            khilldata.com
          </a>
        </p>
      </footer>
    </div>
  );
}
