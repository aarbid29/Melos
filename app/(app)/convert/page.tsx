"use client";

import React, { useState } from "react";

const AudioInput = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("Inactive");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const [audioStream, setAudioStream] = useState(null); // State for audio stream

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name); // Store the file name
    }
  };

  //file.data use to hab data

  const startRecording = async () => {
    try {
      // Request audio stream from the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream); // Store the stream for later use

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder); // Set the MediaRecorder

      recorder.ondataavailable = (event) => {
        const audioBlob = new Blob([event.data], { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url); // Update the audio URL to preview the recording
        setRecordingStatus("Finished");
      };

      recorder.start(); // Start recording
      setRecording(true); // Update the state to show recording is active
      setRecordingStatus("Recording"); // Show status message
    } catch (err: any) {
      console.error("Error accessing the microphone", err);
      setRecordingStatus("Error: " + err.message); // Show error if microphone access fails
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && audioStream) {
      mediaRecorder.stop(); // Stop the recording
      audioStream.getTracks().forEach((track) => track.stop()); // Stop the audio stream tracks
      setRecording(false); // Update the recording state
    }
  };

  const buttonClass =
    "px-4 py-2 rounded-lg shadow-lg text-white bg-cyan-600 hover:bg-cyan-700 transition duration-300 text-sm w-full";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="flex flex-wrap gap-6 p-4">
        {/* Upload Music Files */}
        <div className="bg-cyan-300 p-4 rounded-lg shadow-lg w-72 text-center">
          <h2 className="text-lg font-semibold text-white mb-3">
            Upload Music Files
          </h2>
          <div className="border-2 border-dashed border-white rounded-lg p-3 h-28 flex items-center justify-center text-white">
            {selectedFile ? (
              <span>{selectedFile}</span> // Display the file name if selected
            ) : (
              "Drag & Drop Music Files Here"
            )}
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
          <a href="/outputs">
            <button className={`mt-3 ${buttonClass}`}>Separate Audio</button>
          </a>
        </div>

        {/* Record Music On the Spot */}
        <div className="bg-cyan-300 p-4 rounded-lg shadow-lg w-72 text-center flex flex-col justify-between">
          <h2 className="text-lg font-semibold text-white mb-3">
            Record Music On the Spot
          </h2>
          <div className="mb-3">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-lg shadow-lg text-white ${
                recording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-cyan-500 hover:bg-cyan-600"
              } transition duration-300 text-sm w-full`}
            >
              {recording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
          <div className="text-sm text-white mb-2">
            Recording Status: {recordingStatus}
          </div>
          {audioUrl && (
            <audio controls src={audioUrl} className="mt-3 w-full">
              Your browser does not support the audio element.
            </audio>
          )}
          {/* Separate Audio Button at the Bottom */}
          <div className="mt-auto">
            <a href="/outputs">
              <button className={buttonClass}>Separate Audio</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioInput;
