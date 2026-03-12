"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { FileUploadField } from "@/components/forms/file-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { submitCertificateRegistration } from "@/actions/submit-certificate-registration";

export default function CertificateRegistrationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [surveyImageUrl, setSurveyImageUrl] = useState("");
  const [session, setSession] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (session.length === 0) {
      toast.error("Vui lòng chọn buổi nhận bằng");
      return;
    }
    if (!surveyImageUrl) {
      toast.error("Vui lòng upload hình ảnh khảo sát tốt nghiệp");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const result = await submitCertificateRegistration({
      fullName: formData.get("fullName") as string,
      studentId: formData.get("studentId") as string,
      className: formData.get("className") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      graduationBatch: formData.get("graduationBatch") as string,
      receiveDate: formData.get("receiveDate") as string,
      session: session[0],
      surveyImageUrl,
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
            Đăng ký thành công!
          </h2>
          <p className="text-neutral-600 mb-6">
            Yêu cầu của bạn đã được gửi. Giáo vụ khoa sẽ xử lý và thông báo qua email.
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
          <h2 className="text-xl font-bold text-[#003399] mb-6">
            Đăng ký nhận bằng tốt nghiệp
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-1.5">
              <Label htmlFor="graduationBatch">Đợt tốt nghiệp <span className="text-red-500">*</span></Label>
              <Input id="graduationBatch" name="graduationBatch" required placeholder="Đợt 1 - 2026" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="receiveDate">Ngày lên nhận bằng <span className="text-red-500">*</span></Label>
              <Input id="receiveDate" name="receiveDate" type="date" required />
            </div>

            <div className="space-y-2">
              <Label>Buổi <span className="text-red-500">*</span></Label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={session.includes("sang")}
                    onCheckedChange={(checked) =>
                      setSession(checked ? ["sang"] : [])
                    }
                  />
                  <span className="text-sm">Sáng (7h - 11h30)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={session.includes("chieu")}
                    onCheckedChange={(checked) =>
                      setSession(checked ? ["chieu"] : [])
                    }
                  />
                  <span className="text-sm">Chiều (13h - 16h30)</span>
                </label>
              </div>
            </div>

            <FileUploadField
              label="Hình ảnh đã thực hiện khảo sát tốt nghiệp"
              accept="image/*"
              folder="certificate-surveys"
              required
              onUploadComplete={setSurveyImageUrl}
            />

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-[#003399] hover:bg-[#0066CC] text-white font-medium"
            >
              {submitting ? "Đang gửi..." : "Gửi đăng ký"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
