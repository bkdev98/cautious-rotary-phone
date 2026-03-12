import Link from "next/link";
import { GraduationCap, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <PageHeader />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-center text-[#003399] mb-8">
          Hệ thống quản lý hồ sơ tốt nghiệp
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/dang-ky-nhan-bang"
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
              <GraduationCap className="h-8 w-8 text-[#003399]" />
            </div>
            <h3 className="text-lg font-semibold text-[#003399] mb-2">
              Đăng ký nhận bằng tốt nghiệp
            </h3>
            <p className="text-sm text-neutral-500">
              Đăng ký thời gian và buổi nhận bằng tốt nghiệp tại khoa
            </p>
          </Link>

          <Link
            href="/ho-so-xet-tot-nghiep"
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-100 transition-colors">
              <FileText className="h-8 w-8 text-[#FFB81C]" />
            </div>
            <h3 className="text-lg font-semibold text-[#003399] mb-2">
              Hồ sơ xét tốt nghiệp
            </h3>
            <p className="text-sm text-neutral-500">
              Nộp hồ sơ xét tốt nghiệp trực tuyến
            </p>
          </Link>

        </div>
      </main>
    </div>
  );
}
