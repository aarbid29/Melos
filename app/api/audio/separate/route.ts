import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No valid file uploaded" },
        { status: 400 }
      );
    }

    const form = new FormData();
    form.append("file", file);

    const fastApiResponse = await fetch(
      "http://localhost:8000/separate/multi", // Ensure this matches your FastAPI endpoint
      {
        method: "POST",
        body: form,
      }
    );

    console.log("FastAPI Response Status:", fastApiResponse.status);
    console.log("FastAPI Response Headers:", fastApiResponse.headers);

    if (!fastApiResponse.ok) {
      const errorDetails = await fastApiResponse.text();
      console.error("FastAPI Error:", errorDetails);
      return NextResponse.json(
        { error: `Upload failed: ${errorDetails}` },
        { status: fastApiResponse.status }
      );
    }

    const contentType = fastApiResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/zip")) {
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }

    const zipArrayBuffer = await fastApiResponse.arrayBuffer();
    const zip = await JSZip.loadAsync(zipArrayBuffer);

    const vocalFile = zip.file("vocals.wav");
    const accompanimentFile = zip.file("accompaniment.wav");

    if (!vocalFile || !accompanimentFile) {
      return NextResponse.json(
        { error: "Failed to extract files from ZIP" },
        { status: 500 }
      );
    }

    const vocalBlob = await vocalFile.async("blob");
    const accompanimentBlob = await accompanimentFile.async("blob");

    // Save the blobs as files in the public directory
    const vocalFileName = `vocals-${Date.now()}.wav`;
    const accompanimentFileName = `accompaniment-${Date.now()}.wav`;

    const publicDir = path.join(process.cwd(), "public");
    const vocalFilePath = path.join(publicDir, vocalFileName);
    const accompanimentFilePath = path.join(publicDir, accompanimentFileName);

    await fs.writeFile(
      vocalFilePath,
      Buffer.from(await vocalBlob.arrayBuffer())
    );
    await fs.writeFile(
      accompanimentFilePath,
      Buffer.from(await accompanimentBlob.arrayBuffer())
    );

    // Create URLs relative to the root
    const vocalUrl = `/${vocalFileName}`;
    const accompanimentUrl = `/${accompanimentFileName}`;

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
