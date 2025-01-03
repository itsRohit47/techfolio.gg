import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ message: "Invalid file", status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const fileName = file.name;
  const { url } = await put(fileName, buffer, {
    access: "public",
  });

  return NextResponse.json({
    message: "File uploaded successfully",
    url,
    status: 200,
  });
}
