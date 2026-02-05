type ContactEmailProps = {
  name: string;
  email: string;
  message: string;
};

export function contactEmailTemplate({
  name,
  email,
  message,
}: ContactEmailProps) {
  return `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111;">
        <h2>New Contact Form Submission</h2>
  
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
  
        <hr style="margin: 16px 0;" />
  
        <p>
          ${message.replace(/\n/g, "<br />")}
        </p>
  
        <hr style="margin: 24px 0;" />
  
        <p style="font-size: 12px; color: #666;">
          Sent from your website contact form.
        </p>
      </div>
    `;
}
