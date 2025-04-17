"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface AudioTrackInfo {
  url: string | null;
  title: string;
}

interface AudioPlayerProps {
  audioInfo: AudioTrackInfo;
}

const AudioPlayer = ({ audioInfo }: AudioPlayerProps) => {
  const { url, title } = audioInfo;
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;

    if (!audio || !canvas || !url) return;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const width = canvas.width;
    const height = canvas.height;
    const canvasContext = canvas.getContext("2d");

    const drawWaveform = () => {
      if (!isPlaying || !canvasContext) return;

      requestAnimationFrame(drawWaveform);

      analyser.getByteTimeDomainData(dataArray);

      canvasContext.fillStyle = "#f3f4f6"; // Background color
      canvasContext.fillRect(0, 0, width, height);

      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = "#3b82f6"; // Waveform color
      canvasContext.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(width, height / 2);
      canvasContext.stroke();
    };

    if (isPlaying) {
      drawWaveform();
    }

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      audioContext.resume(); // Ensure audio context is active
      drawWaveform();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      updateTime();
    };

    const handleLoadedMetadata = () => {
      updateDuration();
    };

    const handleVolumeChange = () => {
      if (audio) {
        audio.volume = volume;
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("volumechange", handleVolumeChange);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("volumechange", handleVolumeChange);
      if (source) {
        source.disconnect();
      }
      if (analyser) {
        analyser.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isPlaying, url, title, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      isPlaying ? audio.pause() : audio.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(event.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVolume(parseFloat(event.target.value));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleDownload = () => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/ /g, "_")}.mp3`; // Adjust filename as needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-md shadow-md w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-20 bg-gray-100 rounded-md mb-2"
        width={300}
        height={80}
      />
      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <span>{formatTime(duration)}</span>
      </div>
      <input
        type="range"
        className="w-full h-1 bg-blue-200 rounded-full appearance-none cursor-pointer"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <button
            onClick={togglePlay}
            className="mr-2 p-2 rounded-full hover:bg-gray-200"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeInputChange}
            className="w-24 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
          />
        </div>
        <button
          onClick={handleDownload}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3m-15-4l-4 4m0 0l4 4m-4-4h12"
            />
          </svg>
        </button>
      </div>
      <audio ref={audioRef} src={url} style={{ display: "none" }} />
    </div>
  );
};

export default function OutputPage() {
  const searchParams = useSearchParams();
  const vocalUrl = searchParams.get("vocalUrl");
  const drumsUrl = searchParams.get("drumsUrl");
  const guitarUrl = searchParams.get("guitarUrl");
  const otherUrl = searchParams.get("otherUrl");
  const originalUrl = searchParams.get("originalUrl"); // Assuming you have originalUrl
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vocalUrl || drumsUrl || guitarUrl || otherUrl || originalUrl) {
      setLoading(false);
    }
  }, [vocalUrl, drumsUrl, guitarUrl, otherUrl, originalUrl]);

  const audioTracks: AudioTrackInfo[] = [
    { url: vocalUrl, title: "Vocals Only" },
    { url: drumsUrl, title: "Drums Only" },
    { url: guitarUrl, title: "Guitar Only" },
    { url: otherUrl, title: "Other Instruments" },
    { url: originalUrl, title: "Original Audio" },
  ];

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        Download & Play
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          audioTracks
            .filter((track) => track.url) // Only render if URL exists
            .map((track) => <AudioPlayer key={track.title} audioInfo={track} />)
        )}
        {!loading && !audioTracks.some((track) => track.url) && (
          <p className="text-gray-600">No audio tracks found in the URL.</p>
        )}
      </div>
    </div>
  );
}
