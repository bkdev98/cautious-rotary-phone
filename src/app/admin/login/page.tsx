"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await authClient.signIn.email({ email, password });

    if (result.error) {
      setError("Email hoặc mật khẩu không đúng");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <PageHeader />
      <main className="max-w-sm mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-lg font-bold text-[#003399] text-center mb-6">
            Đăng nhập quản trị
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@iuh.edu.vn"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#003399] hover:bg-[#0066CC] text-white"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
