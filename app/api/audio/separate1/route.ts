import { NextRequest, NextResponse } from "next/server";

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
    console.log("Uploaded file name:", file.name);
    console.log("Uploaded file size:", file.size);
    console.log("Uploaded file type:", file.type);

    return NextResponse.json(
      { message: "File uploaded successfully", fileName: file.name },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
