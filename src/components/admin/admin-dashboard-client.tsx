"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateSubmissionStatus } from "@/actions/update-submission-status";
import { SubmissionDetailPanel } from "./submission-detail-panel";

type Status = "PENDING" | "APPROVED" | "REJECTED";

interface CertificateRecord {
  id: string;
  fullName: string;
  studentId: string;
  className: string;
  phone: string;
  email: string;
  graduationBatch: string;
  receiveDate: string;
  session: string;
  surveyImageUrl: string;
  status: Status;
  adminNote: string | null;
  createdAt: string;
}

interface ApplicationRecord {
  id: string;
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
  transcriptUrl: string | null;
  overdueReasonFormUrl: string | null;
  status: Status;
  adminNote: string | null;
  createdAt: string;
}

interface FeedbackRecord {
  id: string;
  fullName: string;
  studentId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface Props {
  certificates: CertificateRecord[];
  applications: ApplicationRecord[];
  feedbacks: FeedbackRecord[];
}

const STATUS_BADGES: Record<Status, { label: string; className: string }> = {
  PENDING: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-800 border-amber-300" },
  APPROVED: { label: "Đã duyệt", className: "bg-green-100 text-green-800 border-green-300" },
  REJECTED: { label: "Từ chối", className: "bg-red-100 text-red-800 border-red-300" },
};

const STATUS_FILTERS: { value: Status | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
];

export function AdminDashboardClient({ certificates, applications, feedbacks }: Props) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [rejectTarget, setRejectTarget] = useState<{
    type: "certificate" | "application";
    id: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  function filterByStatus<T extends { status: Status }>(items: T[]) {
    if (statusFilter === "ALL") return items;
    return items.filter((i) => i.status === statusFilter);
  }

  async function handleApprove(type: "certificate" | "application", id: string) {
    setProcessing(true);
    const result = await updateSubmissionStatus(type, id, "APPROVED");
    setProcessing(false);
    if (result.success) {
      toast.success("Đã duyệt và gửi email thông báo");
      setSelectedCert(null);
      setSelectedApp(null);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleRejectConfirm() {
    if (!rejectTarget || rejectReason.length < 5) {
      toast.error("Vui lòng nhập lý do (ít nhất 5 ký tự)");
      return;
    }
    setProcessing(true);
    const result = await updateSubmissionStatus(
      rejectTarget.type, rejectTarget.id, "REJECTED", rejectReason
    );
    setProcessing(false);
    if (result.success) {
      toast.success("Đã từ chối và gửi email thông báo");
      setRejectTarget(null);
      setRejectReason("");
      setSelectedCert(null);
      setSelectedApp(null);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Đăng ký nhận bằng" value={certificates.length} />
        <StatCard label="Hồ sơ xét TN" value={applications.length} />
        <StatCard
          label="Đánh giá TB"
          value={feedbacks.length > 0
            ? Math.round((feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length) * 10) / 10
            : 0}
        />
        <StatCard
          label="Chờ duyệt"
          value={
            certificates.filter((c) => c.status === "PENDING").length +
            applications.filter((a) => a.status === "PENDING").length
          }
          accent
        />
        <StatCard
          label="Đã duyệt"
          value={
            certificates.filter((c) => c.status === "APPROVED").length +
            applications.filter((a) => a.status === "APPROVED").length
          }
        />
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-4">
        {STATUS_FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(f.value)}
            className={statusFilter === f.value ? "bg-[#003399]" : ""}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="certificate">
        <TabsList className="h-10 bg-neutral-200 p-1 rounded-lg">
          <TabsTrigger value="certificate" className="px-4 py-2 text-sm">Đăng ký nhận bằng</TabsTrigger>
          <TabsTrigger value="application" className="px-4 py-2 text-sm">Hồ sơ xét TN</TabsTrigger>
          <TabsTrigger value="feedback" className="px-4 py-2 text-sm">Đánh giá ({feedbacks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="certificate">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>MSSV</TableHead>
                  <TableHead>Đợt TN</TableHead>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterByStatus(certificates).map((cert) => (
                  <TableRow
                    key={cert.id}
                    className="cursor-pointer hover:bg-blue-50/50"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <TableCell className="font-medium">{cert.fullName}</TableCell>
                    <TableCell>{cert.studentId}</TableCell>
                    <TableCell>{cert.graduationBatch}</TableCell>
                    <TableCell>{formatDate(cert.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_BADGES[cert.status].className}>
                        {STATUS_BADGES[cert.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filterByStatus(certificates).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-neutral-400 py-8">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="application">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>MSSV</TableHead>
                  <TableHead>Quá hạn</TableHead>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterByStatus(applications).map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer hover:bg-blue-50/50"
                    onClick={() => setSelectedApp(app)}
                  >
                    <TableCell className="font-medium">{app.fullName}</TableCell>
                    <TableCell>{app.studentId}</TableCell>
                    <TableCell>{app.isOverdue ? "Có" : "Không"}</TableCell>
                    <TableCell>{formatDate(app.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_BADGES[app.status].className}>
                        {STATUS_BADGES[app.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filterByStatus(applications).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-neutral-400 py-8">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>MSSV</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nhận xét</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell className="font-medium">{fb.fullName}</TableCell>
                    <TableCell>{fb.studentId}</TableCell>
                    <TableCell>{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</TableCell>
                    <TableCell className="max-w-xs truncate">{fb.comment || "—"}</TableCell>
                    <TableCell>{formatDate(fb.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {feedbacks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-neutral-400 py-8">
                      Chưa có đánh giá
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Certificate detail panel */}
      <SubmissionDetailPanel
        open={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title="Chi tiết đăng ký nhận bằng"
        status={selectedCert?.status}
        adminNote={selectedCert?.adminNote}
        fields={
          selectedCert
            ? [
                { label: "Họ tên", value: selectedCert.fullName },
                { label: "MSSV", value: selectedCert.studentId },
                { label: "Lớp", value: selectedCert.className },
                { label: "SĐT", value: selectedCert.phone },
                { label: "Email", value: selectedCert.email },
                { label: "Đợt TN", value: selectedCert.graduationBatch },
                { label: "Ngày nhận", value: formatDate(selectedCert.receiveDate) },
                { label: "Buổi", value: selectedCert.session === "sang" ? "Sáng (7h-11h30)" : "Chiều (13h-16h30)" },
              ]
            : []
        }
        fileFields={
          selectedCert
            ? [{ label: "Ảnh khảo sát TN", key: selectedCert.surveyImageUrl }]
            : []
        }
        onApprove={
          selectedCert?.status === "PENDING"
            ? () => handleApprove("certificate", selectedCert!.id)
            : undefined
        }
        onReject={
          selectedCert?.status === "PENDING"
            ? () =>
                setRejectTarget({ type: "certificate", id: selectedCert!.id })
            : undefined
        }
        processing={processing}
      />

      {/* Application detail panel */}
      <SubmissionDetailPanel
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Chi tiết hồ sơ xét tốt nghiệp"
        status={selectedApp?.status}
        adminNote={selectedApp?.adminNote}
        fields={
          selectedApp
            ? [
                { label: "Họ tên", value: selectedApp.fullName },
                { label: "MSSV", value: selectedApp.studentId },
                { label: "Lớp", value: selectedApp.className },
                { label: "SĐT", value: selectedApp.phone },
                { label: "Email", value: selectedApp.email },
                { label: "SV quá hạn", value: selectedApp.isOverdue ? "Có" : "Không" },
              ]
            : []
        }
        fileFields={
          selectedApp
            ? [
                { label: "Đơn xét TN", key: selectedApp.applicationFormUrl },
                { label: "Bản sao khai sinh", key: selectedApp.birthCertificateUrl },
                { label: "CC Ngoại ngữ", key: selectedApp.foreignLanguageCertUrl },
                { label: "CC Tin học", key: selectedApp.itCertUrl },
                { label: "Biên nhận CC Tin học", key: selectedApp.itCertReceiptUrl },
                { label: "Biên nhận CC Ngoại ngữ", key: selectedApp.foreignLangReceiptUrl },
                ...(selectedApp.transcriptUrl
                  ? [{ label: "Bảng điểm", key: selectedApp.transcriptUrl }]
                  : []),
                ...(selectedApp.overdueReasonFormUrl
                  ? [{ label: "Đơn lý do quá hạn", key: selectedApp.overdueReasonFormUrl }]
                  : []),
              ]
            : []
        }
        onApprove={
          selectedApp?.status === "PENDING"
            ? () => handleApprove("application", selectedApp!.id)
            : undefined
        }
        onReject={
          selectedApp?.status === "PENDING"
            ? () =>
                setRejectTarget({ type: "application", id: selectedApp!.id })
            : undefined
        }
        processing={processing}
      />

      {/* Reject reason modal */}
      <Dialog open={!!rejectTarget} onOpenChange={() => setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Nhập lý do từ chối..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={processing || rejectReason.length < 5}
            >
              {processing ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p
        className={`text-2xl font-bold mt-1 ${
          accent ? "text-[#FFB81C]" : "text-[#003399]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
