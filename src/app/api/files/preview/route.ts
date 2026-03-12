import { NextRequest, NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/lib/r2";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "key required" }, { status: 400 });
  }

  try {
    const url = await getPresignedDownloadUrl(key);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}
