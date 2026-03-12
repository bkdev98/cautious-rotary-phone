"use server";

import { prisma } from "@/lib/prisma";

interface CertificateFormData {
  fullName: string;
  studentId: string;
  className: string;
  phone: string;
  email: string;
  graduationBatch: string;
  receiveDate: string;
  session: string;
  surveyImageUrl: string;
}

export async function submitCertificateRegistration(data: CertificateFormData) {
  try {
    if (!data.fullName || !data.studentId || !data.email || !data.surveyImageUrl) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    }

    await prisma.certificateRegistration.create({
      data: {
        fullName: data.fullName,
        studentId: data.studentId,
        className: data.className,
        phone: data.phone,
        email: data.email,
        graduationBatch: data.graduationBatch,
        receiveDate: new Date(data.receiveDate),
        session: data.session,
        surveyImageUrl: data.surveyImageUrl,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}
