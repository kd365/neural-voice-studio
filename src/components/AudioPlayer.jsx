// These are all commonly used react hooks.  If you're interested, read up on them here: https://reactjs.org/docs/hooks-intro.html

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download } from "lucide-react";
import { createAudioBlob, createAudioUrl, downloadAudio } from "../utils/audioUtils";

// We're writing a function that making it exportable so it can be called elsewhere in the app
export default function AudioPlayer({ audioData, voiceId }) {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // This useEffect is so we can create and cleanup audio URL when audioData changes
  useEffect(() => {
    if (!audioData) return;
    
    const blob = createAudioBlob(audioData);
    const url = createAudioUrl(blob);
    setAudioUrl(url);

    // Cleanup function - runs when audioData changes or component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioData]);
  // Set up audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    const blob = createAudioBlob(audioData);
    downloadAudio(blob, `speech-${voiceId}-${Date.now()}.mp3`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // The final part of a standard React component is a return statement.  More on that to follow...
  return (
    <div style={{ 
      marginTop: "1rem", 
      padding: "1rem", 
      border: "1px solid #ddd", 
      borderRadius: "8px" 
    }}>
      <audio ref={audioRef} src={audioUrl} />
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={togglePlay} style={{
          background: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <div style={{ flex: 1 }}>
          <div style={{
            background: "#e5e7eb",
            height: "6px",
            borderRadius: "3px",
            overflow: "hidden"
          }}>
            <div style={{
              background: "#3b82f6",
              height: "100%",
              width: `${progress}%`,
              transition: "width 0.1s"
            }} />
          </div>
          <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <button onClick={handleDownload} style={{
          background: "#6b7280",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "0.5rem",
          cursor: "pointer"
        }}>
          <Download size={20} />
        </button>
      </div>
    </div>
  );
}
