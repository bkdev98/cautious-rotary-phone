"use server";

import { prisma } from "@/lib/prisma";

interface ApplicationFormData {
  fullName: string;
  studentId: string;
  className: string;
  phone: string;
  email: string;
  isOverdue: boolean;
  applicationFormUrl: string;
  birthCertificateUrl: string;
  foreignLanguageCertUrl: string;
  itCertUrl: string;
  itCertReceiptUrl: string;
  foreignLangReceiptUrl: string;
  transcriptUrl?: string;
  overdueReasonFormUrl?: string;
}

export async function submitGraduationApplication(data: ApplicationFormData) {
  try {
    if (!data.fullName || !data.studentId || !data.email || !data.applicationFormUrl) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    }

    if (data.isOverdue && (!data.transcriptUrl || !data.overdueReasonFormUrl)) {
      return { success: false, error: "SV quá hạn cần nộp bảng điểm và đơn trình bày lý do" };
    }

    await prisma.graduationApplication.create({
      data: {
        fullName: data.fullName,
        studentId: data.studentId,
        className: data.className,
        phone: data.phone,
        email: data.email,
        isOverdue: data.isOverdue,
        applicationFormUrl: data.applicationFormUrl,
        birthCertificateUrl: data.birthCertificateUrl,
        foreignLanguageCertUrl: data.foreignLanguageCertUrl,
        itCertUrl: data.itCertUrl,
        itCertReceiptUrl: data.itCertReceiptUrl,
        foreignLangReceiptUrl: data.foreignLangReceiptUrl,
        transcriptUrl: data.transcriptUrl || null,
        overdueReasonFormUrl: data.overdueReasonFormUrl || null,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}
