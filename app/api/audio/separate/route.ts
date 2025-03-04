import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  try {
    // Extract the form data from the request
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No valid file uploaded" },
        { status: 400 }
      );
    }

    // Create a FormData to send the file to the FastAPI server
    const form = new FormData();
    form.append("file", file);

    // Send the file to the FastAPI server
    const fastApiResponse = await fetch(
      "http://localhost:8000/separate-voice",
      {
        method: "POST",
        body: form,
      }
    );

    console.log("FastAPI Response Status:", fastApiResponse);

    if (!fastApiResponse.ok) {
      const errorDetails = await fastApiResponse.text();
      return NextResponse.json(
        { error: `Upload failed: ${errorDetails}` },
        { status: fastApiResponse.status }
      );
    }

    // Convert response to ArrayBuffer (needed for JSZip)
    const zipArrayBuffer = await fastApiResponse.arrayBuffer();
    console.log("zipArrayBuffer:", zipArrayBuffer);

    // Load the ZIP file with JSZip
    const zip = await JSZip.loadAsync(zipArrayBuffer);

    // Extract files
    const vocalFile = zip.file("vocals.wav");
    const accompanimentFile = zip.file("accompaniment.wav");

    if (!vocalFile || !accompanimentFile) {
      return NextResponse.json(
        { error: "Failed to extract files from ZIP" },
        { status: 500 }
      );
    }

    // Convert extracted files to Blobs
    const vocalBlob = await vocalFile.async("blob");
    const accompanimentBlob = await accompanimentFile.async("blob");

    // Create URLs for frontend use
    const vocalUrl = URL.createObjectURL(vocalBlob);
    const accompanimentUrl = URL.createObjectURL(accompanimentBlob);

    return NextResponse.json({
      message: "Audio separation successful",
      vocalUrl,
      accompanimentUrl,
    });
  } catch (error: any) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
