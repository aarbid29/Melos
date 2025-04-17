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
      "http://localhost:8000/separate/multi",
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

    // const zipArrayBuffer = await fastApiResponse.arrayBuffer();
    // const zip = await JSZip.loadAsync(zipArrayBuffer);

    const zipArrayBuffer = await fastApiResponse.arrayBuffer();
    console.log("ArrayBuffer byteLength:", zipArrayBuffer.byteLength);

    if (zipArrayBuffer.byteLength === 0) {
      throw new Error("Zip file is empty — check server response.");
    }

    const zip = await JSZip.loadAsync(zipArrayBuffer);

    const vocalFile = zip.file("vocals.wav");
    const drumsFile = zip.file("drums.wav");
    const guitarFile = zip.file("guitar.wav");
    const otherFile = zip.file("other.wav");

    if (!vocalFile || !drumsFile || !guitarFile || !otherFile) {
      return NextResponse.json(
        { error: "Failed to extract files from ZIP" },
        { status: 500 }
      );
    }

    const vocalBlob = await vocalFile.async("blob");
    const drumsBlob = await drumsFile.async("blob");
    const guitarBlob = await guitarFile.async("blob");
    const otherBlob = await otherFile.async("blob");

    const timestamp = Date.now();
    const vocalFileName = `vocals-${timestamp}.wav`;
    const drumsFileName = `drums-${timestamp}.wav`;
    const guitarFileName = `guitar-${timestamp}.wav`;
    const otherFileName = `other-${timestamp}.wav`;

    const publicDir = path.join(process.cwd(), "public");
    const vocalFilePath = path.join(publicDir, vocalFileName);
    const drumsFilePath = path.join(publicDir, drumsFileName);
    const guitarFilePath = path.join(publicDir, guitarFileName);
    const otherFilePath = path.join(publicDir, otherFileName);

    await fs.writeFile(
      vocalFilePath,
      Buffer.from(await vocalBlob.arrayBuffer())
    );
    await fs.writeFile(
      drumsFilePath,
      Buffer.from(await drumsBlob.arrayBuffer())
    );
    await fs.writeFile(
      guitarFilePath,
      Buffer.from(await guitarBlob.arrayBuffer())
    );
    await fs.writeFile(
      otherFilePath,
      Buffer.from(await otherBlob.arrayBuffer())
    );

    const vocalUrl = `/${vocalFileName}`;
    const drumsUrl = `/${drumsFileName}`;
    const guitarUrl = `/${guitarFileName}`;
    const otherUrl = `/${otherFileName}`;

    return NextResponse.json({
      message: "Audio separation successful",
      vocalUrl,
      drumsUrl,
      guitarUrl,
      otherUrl,
    });
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Unexpected server error", details: error.message },
      { status: 500 }
    );
  }
}
