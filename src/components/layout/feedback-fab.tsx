import Link from "next/link";
import { MessageSquare } from "lucide-react";

export function FeedbackFab() {
  return (
    <Link
      href="/danh-gia"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#003399] hover:bg-[#0066CC] text-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
      title="Góp ý"
    >
      <MessageSquare className="h-5 w-5" />
      <span className="text-sm font-medium">Góp ý</span>
    </Link>
  );
}
