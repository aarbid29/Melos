"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OutputPage() {
  const searchParams = useSearchParams();
  const vocalsUrl = searchParams.get("vocalsUrl");
  const accompanimentUrl = searchParams.get("accompanimentUrl");
  const [loading, setLoading] = useState(true);
  const [vocalsVolume, setVocalsVolume] = useState(1);
  const [accompanimentVolume, setAccompanimentVolume] = useState(1);

  useEffect(() => {
    if (vocalsUrl && accompanimentUrl) {
      setLoading(false);
    }
  }, [vocalsUrl, accompanimentUrl]);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVocalsVolumeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVocalsVolume(parseFloat(event.target.value));
  };

  const handleAccompanimentVolumeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAccompanimentVolume(parseFloat(event.target.value));
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cyan-200">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        Download & Play Your Files
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {vocalsUrl && (
          <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">
              Vocals
            </h2>
            <audio
              controls
              src={vocalsUrl}
              className="w-full mb-3"
              volume={vocalsVolume}
            />
            <div className="flex items-center mb-4">
              <label
                htmlFor="vocalsVolume"
                className="text-sm text-gray-600 mr-2 w-24"
              >
                Volume:
              </label>
              <input
                type="range"
                id="vocalsVolume"
                min="0"
                max="1"
                step="0.01"
                value={vocalsVolume}
                onChange={handleVocalsVolumeChange}
                className="w-full h-1 bg-blue-200 rounded-full appearance-none cursor-pointer focus:outline-none"
              />
            </div>
            <div className="text-center">
              <button
                onClick={() =>
                  handleDownload(
                    vocalsUrl,
                    vocalsUrl.substring(vocalsUrl.lastIndexOf("/") + 1)
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Download Vocals
              </button>
            </div>
          </div>
        )}
        {accompanimentUrl && (
          <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-center text-green-600">
              Accompaniment
            </h2>
            <audio
              controls
              src={accompanimentUrl}
              className="w-full mb-3"
              volume={accompanimentVolume}
            />
            <div className="flex items-center mb-4">
              <label
                htmlFor="accompanimentVolume"
                className="text-sm text-gray-600 mr-2 w-24"
              >
                Volume:
              </label>
              <input
                type="range"
                id="accompanimentVolume"
                min="0"
                max="1"
                step="0.01"
                value={accompanimentVolume}
                onChange={handleAccompanimentVolumeChange}
                className="w-full h-1 bg-green-200 rounded-full appearance-none cursor-pointer focus:outline-none"
              />
            </div>
            <div className="text-center">
              <button
                onClick={() =>
                  handleDownload(
                    accompanimentUrl,
                    accompanimentUrl.substring(
                      accompanimentUrl.lastIndexOf("/") + 1
                    )
                  )
                }
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                Download Accompaniment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
