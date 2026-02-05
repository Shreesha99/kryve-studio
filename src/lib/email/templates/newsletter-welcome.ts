type WelcomeEmailParams = {
  unsubscribeUrl: string;
};

export function newsletterWelcomeEmail({
  unsubscribeUrl,
}: WelcomeEmailParams): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to The Elysium Project</title>
  
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #111111;
      }
  
      .wrapper {
        width: 100%;
        padding: 32px 16px;
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e6e6e6;
      }
  
      .header {
        background-color: #0f0f0f;
        padding: 40px 24px 32px;
        text-align: center;
      }
  
      .logo {
        display: inline-block;
      }
  
      .content {
        padding: 40px 36px;
        text-align: center;
      }
  
      h1 {
        font-size: 22px;
        font-weight: 600;
        letter-spacing: -0.01em;
        margin: 0 0 16px;
        color: #0f0f0f;
      }
  
      p {
        font-size: 15px;
        line-height: 1.65;
        margin: 0 0 18px;
        color: #444444;
      }
  
      .divider {
        height: 1px;
        width: 48px;
        margin: 28px auto;
        background-color: #e5e5e5;
      }
  
      .gif {
        margin: 28px 0;
      }
  
      .gif img {
        max-width: 200px;
        border-radius: 10px;
      }
  
      .footer {
        padding: 28px 24px 32px;
        background-color: #fafafa;
        text-align: center;
        font-size: 12px;
        color: #777777;
        border-top: 1px solid #e6e6e6;
      }
  
      .footer a {
        color: #111111;
        text-decoration: underline;
      }
    </style>
  </head>
  
  <body>
    <div class="wrapper">
      <div class="container">
  
        <!-- HEADER / LOGO -->
        <div class="header">
          <svg
            class="logo"
            width="140"
            height="48"
            viewBox="0 1 24 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
  
        <!-- CONTENT -->
        <div class="content">
          <h1>Welcome</h1>
  
          <p>
            You’ve been added to the mailing list for
            <strong>The Elysium Project</strong>.
          </p>
  
          <p>
            From time to time, we share work, ideas, and perspectives from our
            studio — focused on design, engineering, and building things with
            intent.
          </p>
  
          <div class="divider"></div>
  
          <div class="gif">
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWNzd29hZHZlYXI5b294MG16ZHA1dTlrYnQzaGZnanRnM3ZudDRmNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nNxFnWQSeQ5qJU05uk/giphy.gif"
              alt="Studio moment"
            />
          </div>
  
          <p>
            We’re glad you’re here.
          </p>
        </div>
  
        <!-- FOOTER -->
        <div class="footer">
          <p>
            If this email wasn’t meant for you, you can unsubscribe at any time.
          </p>
          <p>
            <a href="${unsubscribeUrl}">Unsubscribe</a>
          </p>
          <p style="margin-top: 12px;">
            © ${new Date().getFullYear()} The Elysium Project
          </p>
        </div>
  
      </div>
    </div>
  </body>
  </html>
  `;
}
