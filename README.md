# IUH Graduation Form System

Hệ thống quản lý hồ sơ tốt nghiệp — **Khoa Thương Mại - Du Lịch**, Trường Đại học Công nghiệp TP.HCM.

## Features

- **Đăng ký nhận bằng tốt nghiệp** — Student registration form with file upload
- **Hồ sơ xét tốt nghiệp** — Graduation application with 6-8 document uploads
- **Admin Dashboard** — Approve/reject submissions with email notifications
- **Email Notifications** — Automated emails via Gmail SMTP

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Prisma ORM + PostgreSQL
- Cloudflare R2 (file storage)
- Nodemailer (Gmail SMTP)
- Better Auth (admin authentication)
- Tailwind CSS + shadcn/ui

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in all values in .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed admin user
npm run db:seed

# Start dev server
npm run dev
```

## Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `R2_*` — Cloudflare R2 credentials
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — Gmail SMTP
- `BETTER_AUTH_SECRET` — Auth secret key
- `NEXT_PUBLIC_APP_URL` — App base URL

## Admin Setup

After seeding, register the admin account:
1. Go to `/admin/login`
2. Use Better Auth signup endpoint to create password for `admin@iuh.edu.vn`

## Deploy to Railway

1. Create new project on Railway
2. Add PostgreSQL service
3. Set environment variables
4. Deploy from GitHub repo
