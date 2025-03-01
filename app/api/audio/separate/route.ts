import { NextRequest, NextResponse } from "next/server";

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

    console.log("Uploaded file name:", file.name);
    console.log("Uploaded file size:", file.size);
    console.log("Uploaded file type:", file.type);

    return NextResponse.json(
      { message: "File uploaded successfully", fileName: file.name },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
