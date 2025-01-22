"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AudioInput = () => {
  const router = useRouter();

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Audio blob for recording
  const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null); // File content for upload
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Audio preview URL
  const [recordingStatus, setRecordingStatus] = useState("Inactive");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null); // Selected file name
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null); // Audio stream
  const [loading, setLoading] = useState(false); // Loading state for server requests
  const [error, setError] = useState<string | null>(null); // Error messages

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setFileContent(e.target.result as ArrayBuffer);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const uploadSeparate = async () => {
    if (!fileContent || !selectedFile) {
      setError("No file selected.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([fileContent], { type: "audio/wav" }),
        selectedFile
      );

      const response = await axios.post("/api/audio/separate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        router.push("/output");
      } else {
        setError("Failed to process the audio file.");
      }
    } catch (error) {
      setError("Error while uploading the file.");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        const blob = new Blob([event.data], { type: "audio/wav" });
        setAudioBlob(blob);

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordingStatus("Finished");
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setRecordingStatus("Recording");
    } catch (err: any) {
      console.error("Error accessing the microphone", err);
      setError("Error accessing the microphone: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && audioStream) {
      mediaRecorder.stop();
      audioStream.getTracks().forEach((track) => track.stop());
      setRecording(false);
      setAudioStream(null);
    }
  };

  const recordSeparate = async () => {
    if (!audioBlob) {
      setError("No recording available.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      const response = await axios.post("/api/audio/separate1", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        router.push("/output1");
      } else {
        setError("Failed to process the recorded audio.");
      }
    } catch (err: any) {
      setError("Error while processing the recording.");
      console.error("Processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingStatus("Inactive");
  };

  const buttonClass =
    "px-4 py-2 rounded-lg shadow-lg text-white bg-cyan-600 hover:bg-cyan-700 transition duration-300 text-sm w-full";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-wrap gap-6 p-4">
        {/* Upload Music Files */}
        <div className="bg-cyan-300 p-4 rounded-lg shadow-lg w-72 text-center">
          <h2 className="text-lg font-semibold text-white mb-3">
            Upload Music Files
          </h2>
          <div className="border-2 border-dashed border-white rounded-lg p-3 h-28 flex items-center justify-center text-white">
            {selectedFile || "Drag & Drop Music Files Here"}
          </div>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="mt-3 hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`mt-1 cursor-pointer ${buttonClass}`}
          >
            Choose Files
          </label>
          <button
            className={`mt-3 ${buttonClass}`}
            onClick={uploadSeparate}
            disabled={loading}
          >
            {loading ? "Processing..." : "Separate Audio"}
          </button>
        </div>

        {/* Record Music On the Spot */}
        <div className="bg-cyan-300 p-4 rounded-lg shadow-lg w-72 text-center flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-3">
            Record Music On the Spot
          </h2>
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-lg shadow-lg text-white ${
              recording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-cyan-500 hover:bg-cyan-600"
            } transition duration-300 text-sm w-full mb-3`}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>
          <div className="text-sm text-white mb-2">
            Recording Status: {recordingStatus}
          </div>
          {audioUrl && (
            <>
              <audio controls src={audioUrl} className="mt-3 w-full">
                Your browser does not support the audio element.
              </audio>
              <button className={`mt-3 ${buttonClass}`} onClick={clearAudio}>
                Clear Audio
              </button>
              <button
                className={`mt-3 ${buttonClass}`}
                onClick={recordSeparate}
                disabled={loading}
              >
                {loading ? "Processing..." : "Separate Audio"}
              </button>
            </>
          )}
        </div>
      </div>
      {error && (
        <div className="text-red-500 mt-4 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AudioInput;
