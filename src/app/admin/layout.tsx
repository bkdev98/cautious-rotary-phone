"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-[#003399] text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm md:text-base font-semibold">
          Quản lý hồ sơ tốt nghiệp — Khoa TMDL
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-white hover:bg-white/10 gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
