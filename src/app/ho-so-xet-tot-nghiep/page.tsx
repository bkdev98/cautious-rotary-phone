"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { FileUploadField } from "@/components/forms/file-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { submitGraduationApplication } from "@/actions/submit-graduation-application";

const TEMPLATE_LINKS = [
  {
    label: "Mẫu Đơn xét tốt nghiệp (hệ tín chỉ)",
    url: "http://iuh.edu.vn/Resource/Upload2/files/documents/Bieumaudaotao/10_Don%20xin%20xet%20tot%20nghiep%20-%20He%20tin%20chi.pdf",
  },
  {
    label: "Mẫu Đơn xét TN cho SV quá thời hạn",
    url: "http://pdt.iuh.edu.vn/wp-content/uploads/2021/10/MAU-02.-Don-xin-XTN_TH-qua-thoi-han-hoc-tap.pdf",
  },
];

export default function GraduationApplicationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isOverdue, setIsOverdue] = useState(false);

  // File upload keys
  const [files, setFiles] = useState({
    applicationFormUrl: "",
    birthCertificateUrl: "",
    foreignLanguageCertUrl: "",
    itCertUrl: "",
    itCertReceiptUrl: "",
    foreignLangReceiptUrl: "",
    transcriptUrl: "",
    overdueReasonFormUrl: "",
  });

  function setFileKey(field: keyof typeof files) {
    return (key: string) => setFiles((prev) => ({ ...prev, [field]: key }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const requiredFiles = [
      "applicationFormUrl", "birthCertificateUrl", "foreignLanguageCertUrl",
      "itCertUrl", "itCertReceiptUrl", "foreignLangReceiptUrl",
    ] as const;

    for (const field of requiredFiles) {
      if (!files[field]) {
        toast.error("Vui lòng upload đầy đủ tất cả các file bắt buộc");
        return;
      }
    }

    if (isOverdue && (!files.transcriptUrl || !files.overdueReasonFormUrl)) {
      toast.error("SV quá hạn cần nộp bảng điểm và đơn trình bày lý do");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const result = await submitGraduationApplication({
      fullName: formData.get("fullName") as string,
      studentId: formData.get("studentId") as string,
      className: formData.get("className") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      isOverdue,
      ...files,
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <PageHeader />
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#003399] mb-2">
            Nộp hồ sơ thành công!
          </h2>
          <p className="text-neutral-600 mb-6">
            Hồ sơ của bạn đã được gửi. Giáo vụ khoa sẽ xem xét và thông báo qua email.
          </p>
          <Link href="/">
            <Button variant="outline">Về trang chủ</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <PageHeader />

      <main className="max-w-xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-[#0066CC] hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#003399] mb-4">
            Hồ sơ xét tốt nghiệp
          </h2>

          {/* Download template links */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-[#003399] mb-2">
              Tải mẫu đơn:
            </p>
            {TEMPLATE_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:underline mb-1 last:mb-0"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                {link.label}
              </a>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student info */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Họ tên <span className="text-red-500">*</span></Label>
              <Input id="fullName" name="fullName" required placeholder="Nguyễn Văn A" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="studentId">Mã số SV <span className="text-red-500">*</span></Label>
                <Input id="studentId" name="studentId" required placeholder="21000001" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="className">Lớp <span className="text-red-500">*</span></Label>
                <Input id="className" name="className" required placeholder="DHQTDL17A" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                <Input id="phone" name="phone" type="tel" required placeholder="0901234567" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" name="email" type="email" required placeholder="sv@iuh.edu.vn" />
              </div>
            </div>

            {/* Overdue toggle */}
            <div className="flex items-center gap-2 py-2">
              <Checkbox
                id="isOverdue"
                checked={isOverdue}
                onCheckedChange={(checked) => setIsOverdue(checked === true)}
              />
              <Label htmlFor="isOverdue" className="cursor-pointer text-sm">
                SV quá thời hạn kết thúc học tập tại trường
              </Label>
            </div>

            {/* Required file uploads */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-neutral-700">
                Hồ sơ cần nộp
              </h3>

              <FileUploadField
                label="1. Đơn xét tốt nghiệp (file Word)"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                folder="applications/don-xet-tn"
                required
                onUploadComplete={setFileKey("applicationFormUrl")}
              />

              <FileUploadField
                label="2. Bản sao khai sinh"
                accept="image/*,.pdf"
                folder="applications/khai-sinh"
                required
                onUploadComplete={setFileKey("birthCertificateUrl")}
              />

              <FileUploadField
                label="3. Chứng chỉ Ngoại ngữ (photo)"
                accept="image/*,.pdf"
                folder="applications/cc-ngoai-ngu"
                required
                onUploadComplete={setFileKey("foreignLanguageCertUrl")}
              />

              <FileUploadField
                label="4. Chứng chỉ Tin học (photo)"
                accept="image/*,.pdf"
                folder="applications/cc-tin-hoc"
                required
                onUploadComplete={setFileKey("itCertUrl")}
              />

              <FileUploadField
                label="5. Biên nhận nộp chứng chỉ Tin học"
                accept="image/*,.pdf"
                folder="applications/bien-nhan-tin-hoc"
                required
                onUploadComplete={setFileKey("itCertReceiptUrl")}
              />

              <FileUploadField
                label="6. Biên nhận nộp chứng chỉ Ngoại ngữ"
                accept="image/*,.pdf"
                folder="applications/bien-nhan-ngoai-ngu"
                required
                onUploadComplete={setFileKey("foreignLangReceiptUrl")}
              />
            </div>

            {/* Conditional overdue uploads */}
            {isOverdue && (
              <div className="space-y-4 pt-2 border-t border-dashed border-neutral-200">
                <h3 className="text-sm font-semibold text-amber-700 pt-2">
                  Hồ sơ bổ sung (SV quá thời hạn)
                </h3>

                <FileUploadField
                  label="7. Bảng điểm"
                  accept="image/*,.pdf"
                  folder="applications/bang-diem"
                  required
                  onUploadComplete={setFileKey("transcriptUrl")}
                />

                <FileUploadField
                  label="8. Đơn trình bày lý do xét quá hạn"
                  accept="image/*,.pdf,.doc,.docx"
                  folder="applications/don-ly-do"
                  required
                  onUploadComplete={setFileKey("overdueReasonFormUrl")}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-[#003399] hover:bg-[#0066CC] text-white font-medium"
            >
              {submitting ? "Đang gửi..." : "Nộp hồ sơ"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
