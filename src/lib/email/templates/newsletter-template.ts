type NewsletterTemplateProps = {
  subject: string;
  content: string; // HTML body from textarea
  unsubscribeUrl?: string;
};

export function newsletterTemplate({
  subject,
  content,
  unsubscribeUrl,
}: NewsletterTemplateProps) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${subject}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f5f5f7;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Helvetica, Arial, sans-serif;
          color: #111;
        }
  
        .wrapper {
          width: 100%;
          padding: 40px 16px;
        }
  
        .container {
          max-width: 640px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
  
        .header {
          padding: 32px;
          background: linear-gradient(
            90deg,
            #ac58e9,
            #b68cd5,
            #c0c0c0
          );
          color: #fff;
        }
  
        .header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
  
        .content {
          padding: 32px;
          font-size: 15px;
          line-height: 1.7;
          color: #222;
        }
  
        .content p {
          margin: 0 0 16px;
        }
  
        .content a {
          color: #ac58e9;
          text-decoration: none;
          font-weight: 500;
        }
  
        .footer {
          padding: 24px 32px;
          font-size: 12px;
          color: #666;
          background: #fafafa;
          text-align: center;
        }
  
        .unsubscribe {
          margin-top: 8px;
          font-size: 11px;
        }
  
        .unsubscribe a {
          color: #888;
          text-decoration: underline;
        }
      </style>
    </head>
  
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>The Elysium Project</h1>
          </div>
  
          <div class="content">
            ${content}
          </div>
  
          <div class="footer">
            <div>© ${new Date().getFullYear()} The Elysium Project</div>
            ${
              unsubscribeUrl
                ? `
              <div class="unsubscribe">
                <a href="${unsubscribeUrl}">Unsubscribe</a>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}
