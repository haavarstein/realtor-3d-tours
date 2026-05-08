import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_BYTES = 200 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds 200 MB limit" },
      { status: 413 }
    );
  }

  const filename = `videos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: "public" });
    return NextResponse.json({ url: blob.url, filename });
  }

  return NextResponse.json({
    url: null,
    filename,
    note: "BLOB_READ_WRITE_TOKEN not set — file accepted but not persisted (MVP demo mode)",
  });
}
