import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [certificates, applications, feedbacks] = await Promise.all([
    prisma.certificateRegistration.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.graduationApplication.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminDashboardClient
      certificates={JSON.parse(JSON.stringify(certificates))}
      applications={JSON.parse(JSON.stringify(applications))}
      feedbacks={JSON.parse(JSON.stringify(feedbacks))}
    />
  );
}
