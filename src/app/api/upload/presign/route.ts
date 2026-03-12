import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl, generateR2Key } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, folder } = await request.json();

    if (!filename || !contentType || !folder) {
      return NextResponse.json(
        { error: "filename, contentType, folder required" },
        { status: 400 }
      );
    }

    // Validate file size limit marker (actual enforcement on R2 side)
    const MAX_SIZE_MB = 5;
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Loại file không hợp lệ. Chấp nhận: ảnh, PDF, Word" },
        { status: 400 }
      );
    }

    const key = generateR2Key(folder, filename);
    const uploadUrl = await getPresignedUploadUrl(key, contentType);

    return NextResponse.json({ uploadUrl, key, maxSizeMB: MAX_SIZE_MB });
  } catch {
    return NextResponse.json(
      { error: "Không thể tạo link upload" },
      { status: 500 }
    );
  }
}
