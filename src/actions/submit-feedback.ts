"use server";

import { prisma } from "@/lib/prisma";

interface FeedbackFormData {
  fullName: string;
  studentId: string;
  rating: number;
  comment?: string;
}

export async function submitFeedback(data: FeedbackFormData) {
  try {
    if (!data.fullName || !data.studentId || !data.rating) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    }

    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: "Đánh giá phải từ 1 đến 5 sao" };
    }

    await prisma.feedback.create({
      data: {
        fullName: data.fullName,
        studentId: data.studentId,
        rating: data.rating,
        comment: data.comment || null,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}
