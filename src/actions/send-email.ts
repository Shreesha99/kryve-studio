'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function sendEmail(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Failed to send message. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error('SMTP configuration is missing from .env.local');
    return {
      success: false,
      message: "Sorry, our email service is currently unavailable. Please try again later.",
    };
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

  try {
    await transporter.verify(); // Verify connection configuration
  } catch (error) {
    console.error('SMTP connection error:', error);
    return {
      success: false,
      message: "There's an issue with our mail server. Please try again later.",
    };
  }
  
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
                background-color: #F5F5F5;
            }
            .email-container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                overflow: hidden;
            }
            .header {
                background-color: #0d0d0d;
                color: #ffffff;
                padding: 30px 40px;
                text-align: center;
            }
            .header h1 {
                font-family: 'Poppins', sans-serif;
                font-size: 24px;
                font-weight: 600;
                margin: 0;
            }
            .content {
                padding: 30px 40px;
                color: #333333;
            }
            .field-group {
                margin-bottom: 25px;
            }
            .field-group .label {
                font-size: 14px;
                font-weight: 600;
                color: #555555;
                margin-bottom: 8px;
                display: block;
            }
            .field-group .value {
                font-size: 16px;
                line-height: 1.5;
                color: #111111;
            }
            .field-group a.value {
                color: #0000ee;
                text-decoration: underline;
            }
            .message-box {
                background-color: #f9f9f9;
                border: 1px solid #eeeeee;
                border-radius: 8px;
                padding: 20px;
            }
            .footer {
                padding: 30px;
                font-size: 12px;
                text-align: center;
                color: #999999;
                background-color: #fafafa;
                border-top: 1px solid #e0e0e0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
                <div class="field-group">
                    <span class="label">From:</span>
                    <span class="value">${name}</span>
                </div>
                <div class="field-group">
                    <span class="label">Email Address:</span>
                    <a href="mailto:${email}" class="value">${email}</a>
                </div>
                <div class="field-group">
                    <span class="label">Message:</span>
                    <div class="message-box value">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>This email was sent from the contact form on The Elysium Project website.</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  try {
    await transporter.sendMail({
      from: `"The Elysium Project" <${SMTP_USER}>`,
      to: SMTP_USER,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: emailHtml,
    });

    return { 
      success: true, 
      message: "Thank you for your message! We'll get back to you soon." 
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      message: "Failed to send your message. Please try again later.",
    };
  }
}
