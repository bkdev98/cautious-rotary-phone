"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitFeedback } from "@/actions/submit-feedback";

export default function FeedbackPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const result = await submitFeedback({
      fullName: formData.get("fullName") as string,
      studentId: formData.get("studentId") as string,
      rating,
      comment: (formData.get("comment") as string) || undefined,
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
            Cảm ơn bạn đã đánh giá!
          </h2>
          <p className="text-neutral-600 mb-6">
            Ý kiến của bạn sẽ giúp chúng tôi cải thiện dịch vụ.
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
            Đánh giá dịch vụ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Họ tên <span className="text-red-500">*</span></Label>
              <Input id="fullName" name="fullName" required placeholder="Nguyễn Văn A" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="studentId">Mã số SV <span className="text-red-500">*</span></Label>
              <Input id="studentId" name="studentId" required placeholder="21000001" />
            </div>

            {/* Star rating */}
            <div className="space-y-1.5">
              <Label>Đánh giá <span className="text-red-500">*</span></Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-[#FFB81C] text-[#FFB81C]"
                          : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="self-center ml-2 text-sm text-neutral-500">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comment">Nhận xét (không bắt buộc)</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Chia sẻ ý kiến của bạn..."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-[#003399] hover:bg-[#0066CC] text-white font-medium"
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
