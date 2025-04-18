import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const actual = formData.get("file");

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

    const zipArrayBuffer = await fastApiResponse.arrayBuffer();
    const zip = await JSZip.loadAsync(zipArrayBuffer);

    const vocalFile = zip.file("vocals.wav");
    const guitarFile = zip.file("guitar.wav");
    const drumsFile = zip.file("drums.wav");
    const otherFile = zip.file("other.wav");

    if (!vocalFile || !guitarFile || !drumsFile || !otherFile) {
      return NextResponse.json(
        { error: "Failed to extract files from ZIP" },
        { status: 500 }
      );
    }

    const vocalBlob = await vocalFile.async("blob");
    const guitarBlob = await guitarFile.async("blob");
    const drumsBlob = await drumsFile.async("blob");
    const otherBlob = await otherFile.async("blob");

    // for  blobs as files in public direct
    const vocalFileName = `vocals-${Date.now()}.wav`;
    const guitarFileName = `guitar-${Date.now()}.wav`;
    const drumsFileName = `drums-${Date.now()}.wav`;
    const otherFileName = `others-${Date.now()}.wav`;

    const actualFileName = `file.name-${Date.now()}.wav`;

    const publicDir = path.join(process.cwd(), "public");
    const vocalFilePath = path.join(publicDir, vocalFileName);
    const guitarFilePath = path.join(publicDir, guitarFileName);
    const drumsFilePath = path.join(publicDir, drumsFileName);
    const otherFilePath = path.join(publicDir, otherFileName);

    const actualFilePath = path.join(publicDir, actualFileName);

    await fs.writeFile(
      vocalFilePath,
      Buffer.from(await vocalBlob.arrayBuffer())
    );
    await fs.writeFile(
      guitarFilePath,
      Buffer.from(await guitarBlob.arrayBuffer())
    );
    await fs.writeFile(
      drumsFilePath,
      Buffer.from(await drumsBlob.arrayBuffer())
    );
    await fs.writeFile(
      otherFilePath,
      Buffer.from(await otherBlob.arrayBuffer())
    );

    await fs.writeFile(actualFilePath, Buffer.from(await actual.arrayBuffer()));

    const vocalUrl = `/${vocalFileName}`;
    const guitarUrl = `/${guitarFileName}`;
    const drumsUrl = `/${drumsFileName}`;
    const otherUrl = `/${otherFileName}`;

    const actualUrl = `/${actualFileName}`;
    return NextResponse.json({
      message: "Audio separation successful",
      vocalUrl,
      guitarUrl,
      drumsUrl,
      otherUrl,
      actualUrl,
    });
  } catch (error: any) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
