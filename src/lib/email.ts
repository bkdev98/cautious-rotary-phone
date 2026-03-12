import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM_NAME = "Khoa Thương Mại - Du Lịch | IUH";
const FROM_EMAIL = process.env.GMAIL_USER;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailOptions) {
  return transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
}

/** Email wrapper for styled IUH emails */
function wrapInTemplate(content: string) {
  return `
    <div style="font-family: 'Be Vietnam Pro', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
      <div style="background: linear-gradient(135deg, #003399, #0066CC); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 18px;">TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP.HCM</h2>
        <p style="color: #FFB81C; margin: 4px 0 0; font-size: 14px;">KHOA THƯƠNG MẠI - DU LỊCH</p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px;">
        ${content}
      </div>
      <p style="text-align: center; font-size: 12px; color: #9CA3AF; margin-top: 16px;">
        Email tự động từ hệ thống quản lý hồ sơ tốt nghiệp
      </p>
    </div>
  `;
}

// Certificate registration approved
export async function sendCertificateApprovalEmail(to: string, fullName: string) {
  return sendEmail({
    to,
    subject: "Thông báo nhận bằng tốt nghiệp - Khoa TMDL",
    html: wrapInTemplate(`
      <p>Xin chào <strong>${fullName}</strong>,</p>
      <p>Giáo vụ khoa đã chuẩn bị bằng theo yêu cầu của bạn, mời bạn đến văn phòng khoa để nhận.</p>
      <p style="margin-top: 24px;">Trân trọng,<br/>Giáo vụ Khoa Thương Mại - Du Lịch</p>
    `),
  });
}

// Certificate registration rejected
export async function sendCertificateRejectionEmail(to: string, fullName: string, reason: string) {
  return sendEmail({
    to,
    subject: "Thông báo về đăng ký nhận bằng - Khoa TMDL",
    html: wrapInTemplate(`
      <p>Xin chào <strong>${fullName}</strong>,</p>
      <p>Yêu cầu nhận bằng tốt nghiệp của bạn chưa được duyệt.</p>
      <p><strong>Lý do:</strong> ${reason}</p>
      <p>Vui lòng kiểm tra và nộp lại.</p>
      <p style="margin-top: 24px;">Trân trọng,<br/>Giáo vụ Khoa Thương Mại - Du Lịch</p>
    `),
  });
}

// Graduation application approved
export async function sendApplicationApprovalEmail(to: string, fullName: string) {
  return sendEmail({
    to,
    subject: "Thông báo hồ sơ xét tốt nghiệp - Khoa TMDL",
    html: wrapInTemplate(`
      <p>Xin chào <strong>${fullName}</strong>,</p>
      <p>Hồ sơ bạn đã đầy đủ, vui lòng mang hồ sơ đến nộp tại khoa.</p>
      <p style="margin-top: 24px;">Trân trọng,<br/>Giáo vụ Khoa Thương Mại - Du Lịch</p>
    `),
  });
}

// Graduation application rejected
export async function sendApplicationRejectionEmail(to: string, fullName: string, reason: string) {
  return sendEmail({
    to,
    subject: "Thông báo hồ sơ xét tốt nghiệp - Khoa TMDL",
    html: wrapInTemplate(`
      <p>Xin chào <strong>${fullName}</strong>,</p>
      <p>Hồ sơ xét tốt nghiệp của bạn chưa được duyệt.</p>
      <p><strong>Lý do:</strong> ${reason}</p>
      <p>Vui lòng kiểm tra và nộp lại.</p>
      <p style="margin-top: 24px;">Trân trọng,<br/>Giáo vụ Khoa Thương Mại - Du Lịch</p>
    `),
  });
}
