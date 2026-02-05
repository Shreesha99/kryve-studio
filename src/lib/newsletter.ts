"use server";

import { initializeFirebase } from "@/firebase/init";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { z } from "zod";
import { mailer } from "@/lib/mailer";
import { newsletterWelcomeEmail } from "./email/templates/newsletter-welcome";

export async function addSubscriber(
  email: string
): Promise<{ success: boolean; message: string }> {
  const { firestore } = initializeFirebase();
  const subscriberDocRef = doc(firestore, "subscribers", email);

  try {
    const docSnap = await getDoc(subscriberDocRef);
    if (docSnap.exists()) {
      return { success: true, message: "You are already subscribed!" };
    }

    await setDoc(subscriberDocRef, {
      email,
      subscribedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Firestore error:", error);
    return { success: false, message: "Database error. Please try again." };
  }

  const siteUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.the-elysium-project.in"
      : "http://localhost:9002";

  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  try {
    await mailer.sendMail({
      from: `"The Elysium Project" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Subscription Confirmed | The Elysium Project",
      html: newsletterWelcomeEmail({ unsubscribeUrl }),
    });
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      success: true,
      message: "Subscribed successfully, but confirmation email failed.",
    };
  }

  return { success: true, message: "Thank you for subscribing!" };
}

const bulkNewsletterSchema = z.object({
  subject: z.string().min(1),
  content: z.string().min(1),
  subscribers: z.array(z.string().email()),
});

export async function sendBulkNewsletter(
  data: z.infer<typeof bulkNewsletterSchema>
): Promise<{ success: boolean; message: string }> {
  const parsed = bulkNewsletterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid newsletter data." };
  }

  const { subject, content, subscribers } = parsed.data;

  if (!subscribers.length) {
    return { success: true, message: "No subscribers to send to." };
  }

  try {
    await mailer.sendMail({
      from: `"The Elysium Project" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      bcc: subscribers,
      subject,
      html: content,
    });

    return {
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers.`,
    };
  } catch (error) {
    console.error("Bulk send failed:", error);
    return { success: false, message: "Failed to send newsletter." };
  }
}
