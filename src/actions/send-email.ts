"use server";

import { z } from "zod";
import { mailer } from "@/lib/mailer";
import { contactEmailTemplate } from "@/lib/email/templates/contact-email";

export type ContactFormState = {
  success: boolean;
  message: string;
};

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function sendEmail(_prev: any, formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid form data." };
  }

  const { name, email, message } = parsed.data;

  try {
    await mailer.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Contact Form Submission`,
      html: contactEmailTemplate({
        name,
        email,
        message,
      }),
    });

    return { success: true, message: "Message sent successfully." };
  } catch (error) {
    console.error("Contact email failed:", error);
    return { success: false, message: "Failed to send message." };
  }
}
