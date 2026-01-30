'use server';

import { initializeFirebase } from '@/firebase/init';
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function addSubscriber(
  email: string
): Promise<{ success: boolean; message: string }> {
  const { firestore } = initializeFirebase();
  const subscriberDocRef = doc(firestore, 'subscribers', email);

  try {
    const docSnap = await getDoc(subscriberDocRef);

    if (docSnap.exists()) {
      return { success: true, message: 'You are already subscribed!' };
    }

    await setDoc(subscriberDocRef, {
      email: email,
      subscribedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Error adding subscriber to Firestore:', error);
    return {
      success: false,
      message: 'Could not connect to the database. Please try again.',
    };
  }

  const { SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('SMTP configuration is missing. Cannot send confirmation email.');
    return {
      success: true,
      message: 'Thank you for subscribing! (Confirmation email pending setup)',
    };
  }

  const transporter = nodemailer.createTransport({
<<<<<<< HEAD
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
=======
    service: 'gmail',
>>>>>>> c863216 (i dont have such email and my app password is correct)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (error) {
    console.error('SMTP connection error:', error);
    return {
      success: true, 
      message:
        'Subscription successful, but failed to connect to the mail server. Please check SMTP credentials.',
    };
  }

  const siteUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://www.the-elysium-project.in'
      : 'http://localhost:9002';
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                overflow: hidden;
                text-align: center;
            }
            .header {
                background-color: #111111;
                padding: 30px 20px;
            }
            .header img.logo {
                max-width: 150px;
            }
            .content {
                padding: 40px 30px;
                color: #333333;
            }
            .content h1 {
                font-family: 'Poppins', sans-serif;
                font-size: 28px;
                font-weight: 600;
                color: #111111;
                margin: 0 0 15px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 25px;
            }
            .gif-container img {
                max-width: 200px;
                margin: 10px auto;
            }
            .footer {
                padding: 30px;
                font-size: 12px;
                color: #999999;
                background-color: #f9f9f9;
                border-top: 1px solid #e0e0e0;
            }
            .footer a {
                color: #555555;
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
        <div class="header">
        <svg
          width="120"
          height="40"
          viewBox="0 1 24 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="display:block;margin:0 auto;"
        >
          <path
            d="M25 7H7V13H20V19H7V25H25"
            stroke="#ffffff"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      
            <div class="content">
                <h1>Welcome to the Fold!</h1>
                <p>You've officially joined the inner circle. We're thrilled to have you with us on our journey of engineering elegance and designing impact.</p>
                <div class="gif-container">
                    <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG82c3NoejFzNHNudWFta2FuYTg5N25nZWQwdHFodXczZG9nNXc0ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nNxFnWQSeQ5qJU05uk/giphy.gif" alt="Celebratory Sparkles">
                </div>
                <p>Expect to receive exclusive insights, project showcases, and stories from our studio—delivered right to your inbox.</p>
            </div>
            <div class="footer">
                <p>If you change your mind or this was a mistake, you can opt out anytime.</p>
                <a href="${unsubscribeUrl}">Unsubscribe</a>
                <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} The Elysium Project. All Rights Reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"The Elysium Project" <${SMTP_USER}>`,
      to: email,
      subject: 'Subscription Confirmed | The Elysium Project',
      html: emailHtml,
    });
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error);
    return { success: true, message: 'Subscription successful, but the confirmation email could not be sent.' };
  }

  return { success: true, message: 'Thank you for subscribing!' };
}
<<<<<<< HEAD
=======

const bulkNewsletterSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  content: z.string().min(1, 'Content is required.'),
  subscribers: z.array(z.string().email()),
});

export async function sendBulkNewsletter(
  data: z.infer<typeof bulkNewsletterSchema>
): Promise<{ success: boolean; message: string }> {
  const validation = bulkNewsletterSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: 'Invalid newsletter data provided.' };
  }

  const { subject, content, subscribers } = validation.data;

  if (subscribers.length === 0) {
    return { success: true, message: 'There are no subscribers to send to.' };
  }

  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error('SMTP configuration is missing.');
    return { success: false, message: 'Email server is not configured.' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"The Elysium Project" <${SMTP_USER}>`,
      to: SMTP_USER, // Send to self
      bcc: subscribers, // BCC all subscribers for privacy
      subject: subject,
      html: content,
    });

    return {
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscriber(s).`,
    };
  } catch (error) {
    console.error('Failed to send bulk newsletter:', error);
    return { success: false, message: 'Failed to send emails.' };
  }
}
>>>>>>> c863216 (i dont have such email and my app password is correct)
