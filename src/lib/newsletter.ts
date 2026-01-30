'use server';
import { initializeFirebase } from '@/firebase/init';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  const { firestore } = initializeFirebase();
  // Use the email as the document ID to enforce uniqueness and simplify logic.
  const subscriberDocRef = doc(firestore, 'subscribers', email);

  try {
    const docSnap = await getDoc(subscriberDocRef);
    
    // 1. Check if the user is already subscribed.
    if (docSnap.exists()) {
      // If they exist, return a success message without sending another email.
      return { success: true, message: 'You are already subscribed!' };
    }

    // 2. If they don't exist, create the new subscriber document.
    await setDoc(subscriberDocRef, {
      email: email,
      subscribedAt: serverTimestamp(),
    });

  } catch (error: any) {
    // This will now only catch actual server errors (e.g., network issues),
    // not permission errors from the `getDoc` call.
    console.error('Error adding subscriber to Firestore:', error);
    return { success: false, message: 'Could not connect to the database. Please try again.' };
  }

  // 3. Send confirmation email ONLY for new subscribers.
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error('SMTP configuration is missing. Cannot send confirmation email.');
    // The subscription was successful, but the email could not be sent.
    // Still a success from the user's perspective.
    return { success: true, message: 'Thank you for subscribing! (Confirmation email pending setup)' };
  }
  
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const siteUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.the-elysium-project.in' 
    : 'http://localhost:9002';
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                <img src="https://www.the-elysium-project.in/og-image.png" alt="The Elysium Project Logo" class="logo">
            </div>
            <div class="content">
                <h1>Welcome to the Fold!</h1>
                <p>You've officially joined the inner circle. We're thrilled to have you with us on our journey of engineering elegance and designing impact.</p>
                <div class="gif-container">
                    <img src="https://media.giphy.com/media/l41YimAQAbyhQkL7i/giphy.gif" alt="Celebratory Sparkles">
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
    // Even if email fails, subscription was successful.
    return { success: true, message: 'Thank you for subscribing!' };
  }

  // Final success message for new subscribers.
  return { success: true, message: 'Thank you for subscribing!' };
}
