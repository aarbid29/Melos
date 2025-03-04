"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AudioInput = () => {
  const router = useRouter();

  const [fileContent, setFileContent] = useState<ArrayBuffer | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      if (response.status !== 200) {
        throw new Error("Upload failed");
      }

      const { vocalUrl,
        accompanimentUrl } = response.data;

      const queryParams = new URLSearchParams({
        vocalsUrl: vocalUrl,
        accompanimentUrl: accompanimentUrl,
      }).toString();

      router.push(`/output?${queryParams}`);
    } catch (error: any) {
      setError(`Error while uploading the file: ${error.message}`);
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
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
        <label htmlFor="file-upload" className="mt-1 cursor-pointer bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-cyan-700 transition duration-300 w-full block text-center">
          Choose File
        </label>

        <button
          className="mt-3 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-cyan-700 transition duration-300 w-full"
          onClick={uploadSeparate}
          disabled={loading}
        >
          {loading ? "Processing..." : "Separate Audio"}
        </button>
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
