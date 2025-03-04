"use client"; // Mark this component as a Client Component

import { useSearchParams } from "next/navigation"; // Use `useSearchParams` for query parameters

export default function OutputPage() {
  const searchParams = useSearchParams();

  // Get the query parameters
  const vocalsUrl = searchParams.get("vocalsUrl");
  const accompanimentUrl = searchParams.get("accompanimentUrl");

  return (
    <div>
      <h1>Download Your Files</h1>

      {vocalsUrl && (
        <div>
          <a href={vocalsUrl} download="vocals.wav">
            Download Vocals
          </a>
        </div>
      )}

      {accompanimentUrl && (
        <div>
          <a href={accompanimentUrl} download="accompaniment.wav">
            Download Accompaniment
          </a>
        </div>
      )}

      {/* If no URLs are found, show an error */}
      {(!vocalsUrl || !accompanimentUrl) && (
        <p style={{ color: "red" }}>No files available for download.</p>
      )}
    </div>
  );
}