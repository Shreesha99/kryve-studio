'use server';

import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type NewsletterFormState = {
  success: boolean;
  message: string;
};

export async function subscribeNewsletter(
  prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const validatedFields = newsletterSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || "Invalid input.",
    };
  }
  
  const { email } = validatedFields.data;

  // In a real application, you would save the email to your database
  // or send it to a newsletter service like Mailchimp.
  console.log(`New newsletter subscription: ${email}`);

  // For this demo, we'll just simulate a successful subscription.
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { 
    success: true, 
    message: "Thank you for subscribing!" 
  };
}
