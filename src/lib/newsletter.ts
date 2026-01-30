'use server';
import { initializeFirebase } from '@/firebase';
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
    console.error('Error adding subscriber: ', error);
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
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
            .button { display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; }
            a { color: #000; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>The Elysium Project</h2>
            </div>
            <h3>Thank you for subscribing!</h3>
            <p>You've been successfully added to our newsletter. You'll be the first to know about our latest projects, insights, and stories.</p>
            <p>We're excited to have you with us.</p>
            <br>
            <p>The Elysium Project Team</p>
            <div class="footer">
                <p>If you did not sign up for this newsletter or wish to stop receiving updates, you can unsubscribe below.</p>
                <a href="${unsubscribeUrl}">Unsubscribe</a>
                <p>&copy; ${new Date().getFullYear()} The Elysium Project. All Rights Reserved.</p>
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
