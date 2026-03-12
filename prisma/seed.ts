import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  // Seed admin user — password set via Better Auth signup endpoint
  const admin = await prisma.user.upsert({
    where: { email: "admin@iuh.edu.vn" },
    update: {},
    create: {
      name: "Admin Khoa TMDL",
      email: "admin@iuh.edu.vn",
      emailVerified: true,
    },
  });

  console.log("Seeded admin user:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
