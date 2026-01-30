'use server';
import { initializeFirebase } from '@/firebase/init';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function addSubscriber(email: string) {
  const { firestore } = initializeFirebase();
  try {
    const subscribersCollection = collection(firestore, 'subscribers');
    await addDoc(subscribersCollection, {
      email: email,
      subscribedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding subscriber to Firestore: ', error);
    // Re-throw the error so the client-side catch block can handle it
    throw new Error('Could not add subscriber to the database.');
  }

  // Send confirmation email
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    // This won't be sent to the client, but it's crucial for server logs
    console.error('SMTP configuration is missing. Cannot send confirmation email.');
    // We don't throw an error here because the main action (subscribing) was successful.
    // The user is subscribed, even if the email fails.
    return;
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
                <img src="https://www.the-elysium-project.in/logo.png" alt="The Elysium Project Logo" class="logo">
            </div>
            <div class="content">
                <h1>Welcome to the Fold!</h1>
                <p>You've officially joined the inner circle. We're thrilled to have you with us on our journey of engineering elegance and designing impact.</p>
                <div class="gif-container">
                    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGphZHNmYmJ5N2Y2cHVyOGFwdmNqYTg2cnRkZzU1MGF5NjN0b2Y5OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Be9bY8c2iS39W1y2Wb/giphy.gif" alt="Celebratory Sparkles">
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
    // Again, don't throw, as the user is already subscribed.
  }
}
