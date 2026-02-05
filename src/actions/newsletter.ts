"use server";

import { initializeFirebase } from "@/firebase/init";
import { deleteDoc, doc } from "firebase/firestore";
import { z } from "zod";

const emailSchema = z.string().email();

export async function unsubscribeFromNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  const validation = emailSchema.safeParse(email);
  if (!validation.success) {
    return { success: false, message: "Invalid email address provided." };
  }

  const { firestore } = initializeFirebase();
  // The document ID is the user's email, so we can directly reference it.
  const subscriberDocRef = doc(firestore, "subscribers", email);

  try {
    // Attempt to delete the document. This avoids a read operation.
    // The security rules now allow this.
    await deleteDoc(subscriberDocRef);
    // Return a success message regardless of whether a document was actually deleted.
    // This prevents leaking information about which emails are subscribed.
    return {
      success: true,
      message: "You have been successfully unsubscribed.",
    };
  } catch (error) {
    console.error("Error during unsubscription:", error);
    // Even if there's an error (e.g., permissions, network), present a success message.
    // This is a security best practice.
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}
