import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  throw new Error("SMTP environment variables are not configured correctly");
}

export const mailer = nodemailer.createTransport({
  host: SMTP_HOST, // smtp.zoho.in
  port: Number(SMTP_PORT), // 587
  secure: Number(SMTP_PORT) === 465, // ✅ CORRECT
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS, // Zoho App Password
  },
  tls: {
    rejectUnauthorized: true,
  },
});
