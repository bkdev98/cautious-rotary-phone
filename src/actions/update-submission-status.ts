"use server";

import { prisma } from "@/lib/prisma";
import {
  sendCertificateApprovalEmail,
  sendCertificateRejectionEmail,
  sendApplicationApprovalEmail,
  sendApplicationRejectionEmail,
} from "@/lib/email";

type SubmissionType = "certificate" | "application";
type StatusAction = "APPROVED" | "REJECTED";

export async function updateSubmissionStatus(
  type: SubmissionType,
  id: string,
  status: StatusAction,
  reason?: string
) {
  try {
    if (status === "REJECTED" && !reason) {
      return { success: false, error: "Vui lòng nhập lý do từ chối" };
    }

    if (type === "certificate") {
      const record = await prisma.certificateRegistration.update({
        where: { id },
        data: { status, adminNote: reason || null },
      });

      // Send email notification
      if (status === "APPROVED") {
        await sendCertificateApprovalEmail(record.email, record.fullName);
      } else {
        await sendCertificateRejectionEmail(record.email, record.fullName, reason!);
      }
    } else {
      const record = await prisma.graduationApplication.update({
        where: { id },
        data: { status, adminNote: reason || null },
      });

      if (status === "APPROVED") {
        await sendApplicationApprovalEmail(record.email, record.fullName);
      } else {
        await sendApplicationRejectionEmail(record.email, record.fullName, reason!);
      }
    }

    return { success: true };
  } catch {
    return { success: false, error: "Lỗi hệ thống" };
  }
}
