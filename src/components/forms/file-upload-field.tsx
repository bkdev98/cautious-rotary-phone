"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadFieldProps {
  label: string;
  accept?: string;
  folder: string;
  required?: boolean;
  onUploadComplete: (key: string) => void;
  error?: string;
}

const MAX_SIZE_MB = 5;

export function FileUploadField({
  label,
  accept = "image/*,.pdf,.doc,.docx",
  folder,
  required,
  onUploadComplete,
  error,
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError(null);

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`File quá lớn. Tối đa ${MAX_SIZE_MB}MB`);
        return;
      }

      setUploading(true);
      try {
        // Get presigned URL
        const res = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            folder,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const { uploadUrl, key } = await res.json();

        // Upload directly to R2
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) throw new Error("Upload to storage failed");

        setFileName(file.name);
        onUploadComplete(key);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Lỗi upload file");
      } finally {
        setUploading(false);
      }
    },
    [folder, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = () => {
    setFileName(null);
    onUploadComplete("");
  };

  const displayError = uploadError || error;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {fileName ? (
        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5">
          <FileText className="h-4 w-4 text-[#003399] shrink-0" />
          <span className="text-sm truncate flex-1">{fileName}</span>
          <button
            type="button"
            onClick={clearFile}
            className="text-neutral-400 hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 transition-colors cursor-pointer",
            uploading
              ? "border-[#0066CC] bg-blue-50"
              : "border-neutral-200 hover:border-[#0066CC] hover:bg-blue-50/30",
            displayError && "border-red-300"
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 text-[#0066CC] animate-spin" />
          ) : (
            <Upload className="h-6 w-6 text-neutral-400" />
          )}
          <span className="text-sm text-neutral-500">
            {uploading ? "Đang tải lên..." : "Kéo thả hoặc nhấn để chọn file"}
          </span>
          <span className="text-xs text-neutral-400">
            Tối đa {MAX_SIZE_MB}MB
          </span>
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}

      {displayError && (
        <p className="text-xs text-red-500">{displayError}</p>
      )}
    </div>
  );
}
