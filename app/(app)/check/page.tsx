"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const AudioUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/ogg": [".ogg"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #ccc",
        borderRadius: "5px",
        padding: "40px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{
            width: "36px",
            height: "36px",
            color: "#6b7280",
            marginBottom: "8px",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.757 1.565 9 9 0 00-2.25-.414m-1.5 4.5v-4.5m0 0l3-3m-3 3l-3-3m-1.5 4.5h4.5"
          />
        </svg>
        {isDragActive ? (
          <p style={{ color: "#4b5563" }}>Drop the files here ...</p>
        ) : (
          <p style={{ color: "#4b5563" }}>
            Drop your audio file here, or{" "}
            <span style={{ color: "#3b82f6" }}>browse</span>
          </p>
        )}
        <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "4px" }}>
          MP3, WAV, or OGG files up to 20MB
        </p>
        {selectedFile && (
          <div
            style={{
              backgroundColor: "#e5e7eb",
              color: "#4b5563",
              padding: "8px 16px",
              borderRadius: "5px",
              marginTop: "16px",
            }}
          >
            {selectedFile.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUploader;
