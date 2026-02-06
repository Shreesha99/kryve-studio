"use server";

import { initializeFirebase } from "@/firebase/init";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { z } from "zod";
import { mailer } from "@/lib/mailer";
import { newsletterWelcomeEmail } from "./email/templates/newsletter-welcome";

export async function addSubscriber(
  email: string
): Promise<{ success: boolean; message: string }> {
  console.log("[Newsletter] addSubscriber called", { email });

  const { firestore } = initializeFirebase();
  const subscriberDocRef = doc(firestore, "subscribers", email);
  mailer.verify((err) => {
    if (err) {
      console.error("[SMTP VERIFY FAILED]", err);
    } else {
      console.log("[SMTP READY - ZOHO]");
    }
  });

  try {
    const docSnap = await getDoc(subscriberDocRef);

    if (docSnap.exists()) {
      console.log("[Newsletter] Subscriber already exists", { email });
      return { success: true, message: "You are already subscribed!" };
    }

    await setDoc(subscriberDocRef, {
      email,
      subscribedAt: serverTimestamp(),
    });

    console.log("[Newsletter] Subscriber saved to Firestore", { email });
  } catch (error) {
    console.error("[Newsletter][Firestore Error]", {
      email,
      error,
    });

    return { success: false, message: "Database error. Please try again." };
  }

  const siteUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.the-elysium-project.in"
      : "http://localhost:9002";

  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  console.log("[Newsletter] Preparing confirmation email", {
    email,
    siteUrl,
    unsubscribeUrl,
    smtpUser: process.env.SMTP_USER ? "SET" : "MISSING",
    smtpHost: process.env.SMTP_HOST ? "SET" : "MISSING",
    smtpPort: process.env.SMTP_PORT ? "SET" : "MISSING",
  });

  try {
    await mailer.sendMail({
      from: `"The Elysium Project" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Subscription Confirmed | The Elysium Project",
      html: newsletterWelcomeEmail({ unsubscribeUrl }),
    });

    console.log("[Newsletter] Confirmation email sent", { email });
  } catch (error: any) {
    console.error("[Newsletter][Email Send Failed]", {
      email,
      errorMessage: error?.message,
      errorCode: error?.code,
      errorStack: error?.stack,
      errorResponse: error?.response,
    });

    return {
      success: true,
      message: "Subscribed successfully, but confirmation email failed.",
    };
  }

  return { success: true, message: "Thank you for subscribing!" };
}

/* ---------------- BULK NEWSLETTER ---------------- */

const bulkNewsletterSchema = z.object({
  subject: z.string().min(1),
  content: z.string().min(1),
  subscribers: z.array(z.string().email()),
});

export async function sendBulkNewsletter(
  data: z.infer<typeof bulkNewsletterSchema>
): Promise<{ success: boolean; message: string }> {
  console.log("[Newsletter] sendBulkNewsletter called", {
    subject: data?.subject,
    subscriberCount: data?.subscribers?.length,
  });

  const parsed = bulkNewsletterSchema.safeParse(data);
  if (!parsed.success) {
    console.error("[Newsletter] Invalid bulk newsletter payload", {
      errors: parsed.error.format(),
    });

    return { success: false, message: "Invalid newsletter data." };
  }

  const { subject, content, subscribers } = parsed.data;

  if (!subscribers.length) {
    console.log("[Newsletter] No subscribers to send bulk email");
    return { success: true, message: "No subscribers to send to." };
  }

  console.log("[Newsletter] Sending bulk email", {
    subject,
    subscriberCount: subscribers.length,
    smtpUser: process.env.SMTP_USER ? "SET" : "MISSING",
  });

  try {
    await mailer.sendMail({
      from: `"The Elysium Project" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      bcc: subscribers,
      subject,
      html: content,
    });

    console.log("[Newsletter] Bulk email sent successfully", {
      subscriberCount: subscribers.length,
    });

    return {
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers.`,
    };
  } catch (error: any) {
    console.error("[Newsletter][Bulk Email Failed]", {
      errorMessage: error?.message,
      errorCode: error?.code,
      errorStack: error?.stack,
      errorResponse: error?.response,
    });

    return { success: false, message: "Failed to send newsletter." };
  }
}
