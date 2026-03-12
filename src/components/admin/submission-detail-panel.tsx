"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Field {
  label: string;
  value: string;
}

interface FileField {
  label: string;
  key: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string | null;
  fields: Field[];
  fileFields: FileField[];
  onApprove?: () => void;
  onReject?: () => void;
  processing: boolean;
}

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-300",
  APPROVED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_LABELS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export function SubmissionDetailPanel({
  open, onClose, title, status, adminNote,
  fields, fileFields, onApprove, onReject, processing,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {title}
            {status && (
              <Badge variant="outline" className={STATUS_STYLES[status]}>
                {STATUS_LABELS[status]}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Info fields */}
        <div className="space-y-2">
          {fields.map((f) => (
            <div key={f.label} className="flex text-sm">
              <span className="text-neutral-500 w-28 shrink-0">{f.label}:</span>
              <span className="font-medium">{f.value}</span>
            </div>
          ))}
        </div>

        {/* Admin note (if rejected) */}
        {adminNote && (
          <div className="bg-red-50 rounded-md p-3 text-sm">
            <span className="font-medium text-red-700">Lý do từ chối: </span>
            <span className="text-red-600">{adminNote}</span>
          </div>
        )}

        {/* File previews */}
        {fileFields.length > 0 && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-semibold text-neutral-700">Hồ sơ đính kèm</h4>
            {fileFields.map((f) => (
              <FilePreviewItem key={f.key} label={f.label} fileKey={f.key} />
            ))}
          </div>
        )}

        {/* Action buttons */}
        {(onApprove || onReject) && (
          <div className="flex gap-3 pt-4 border-t">
            {onApprove && (
              <Button
                onClick={onApprove}
                disabled={processing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {processing ? "Đang xử lý..." : "Duyệt"}
              </Button>
            )}
            {onReject && (
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={processing}
                className="flex-1"
              >
                Từ chối
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Fetches presigned URL and shows image preview or download link */
function FilePreviewItem({ label, fileKey }: { label: string; fileKey: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileKey);

  useEffect(() => {
    if (!fileKey) return;
    fetch(`/api/files/preview?key=${encodeURIComponent(fileKey)}`)
      .then((r) => r.json())
      .then((data) => setUrl(data.url))
      .catch(() => {});
  }, [fileKey]);

  return (
    <div className="space-y-1">
      <p className="text-xs text-neutral-500">{label}</p>
      {!url ? (
        <div className="h-10 bg-neutral-100 rounded animate-pulse" />
      ) : isImage ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="max-h-48 rounded border object-contain"
          />
        </a>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[#0066CC] hover:underline"
        >
          <Download className="h-3.5 w-3.5" />
          Tải xuống
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
