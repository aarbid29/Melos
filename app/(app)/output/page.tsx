import { useRouter } from "next/router";

export default function OutputPage() {
  const router = useRouter();
  const { vocalsUrl, accompanimentUrl } = router.query;

  return (
    <div>
      <h1>Download Your Files</h1>

      {vocalsUrl && (
        <div>
          <a href={vocalsUrl as string} download="vocals.wav">
            Download Vocals
          </a>
        </div>
      )}

      {accompanimentUrl && (
        <div>
          <a href={accompanimentUrl as string} download="accompaniment.wav">
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
