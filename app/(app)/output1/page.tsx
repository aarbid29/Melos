import React from "react";

export default function output1() {
  return (
    <div>
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Melos</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Separate vocals from instrumentals with a single click. Upload or
          record audio to get started.
        </p>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Supported file formats: MP3, WAV, OGG, M4A</p>
        <p className="mt-1">Maximum file size: 20MB</p>
      </div>
      <div className="mt-16 border-t pt-8 animate-slide-up">
        <h2 className="text-xl font-semibold mb-4 text-center">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="border rounded-xl p-6 text-center">
            <div className="mb-4 w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center"></div>
            <h3 className="text-lg font-medium mb-2">Upload or Record</h3>
            <p className="text-sm text-muted-foreground">
              Upload an audio file or record directly using your microphone.
            </p>
          </div>

          <div className="border rounded-xl p-6 text-center">
            <div className="mb-4 w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center"></div>
            <h3 className="text-lg font-medium mb-2">Separate Tracks</h3>
            <p className="text-sm text-muted-foreground">
              Our algorithm separates vocals from instrumentals.
            </p>
          </div>

          <div className="border rounded-xl p-6 text-center">
            <div className="mb-4 w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center"></div>
            <h3 className="text-lg font-medium mb-2">Download Results</h3>
            <p className="text-sm text-muted-foreground">
              Listen to and download the separated audio tracks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
