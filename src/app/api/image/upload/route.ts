import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // const formData = await request.formData() as FormData;
  // const file = formData.get("file") as File;
  // console.log(file);
  // const body = await request.json();
  // console.log(body);

  return NextResponse.json({ message: "Hello World", status: 200 });
}
