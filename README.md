# The Elysium Project - A Next.js Starter

Welcome to The Elysium Project, a premium, minimal starter for a digital studio website. This project is built with a modern tech stack and is designed to be easily customizable. It includes a variety of pre-built components, a blog, AI-powered features, and a contact form, all styled with a sleek and professional design.

## Features

- **Modern Tech Stack:** Next.js 14 (App Router), React, TypeScript.
- **Styling:** Tailwind CSS and ShadCN UI for a beautiful, consistent, and customizable design system.
- **Database:** Fully integrated with Firebase Firestore for dynamic content management.
- **Admin Dashboard:** A secure admin area to create, update, and delete blog posts directly in Firestore.
- **AI-Powered Features (Genkit):**
    - **Blog Post Generator:** Enter a topic and let AI craft a full blog post.
    - **Vision Board Generator:** Generate a mood, color palette, and image from a concept to kickstart creativity.
- **Interactive Components:**
    - **Animated Keyboard:** A fully interactive keyboard animation on the blog page that measures your typing speed (WPM) and includes fun easter eggs.
    - **Animations:** Smooth page transitions and component animations powered by GSAP.
- **Contact Form:** A working contact form that uses Nodemailer and Next.js Server Actions.
- **SEO Optimized:** Pre-configured for maximum search engine visibility with a dynamic sitemap, robots.txt, and structured metadata.

## Getting Started

### Prerequisites

- Node.js (v18.17 or later)
- npm, yarn, or pnpm
- A Firebase project with Firestore enabled.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/elysium-project.git
    cd elysium-project
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Set up your environment variables. Create a `.env.local` file in the root of the project and add your SMTP credentials for the contact form, a password for the admin dashboard, and your Firebase project credentials:
    ```
    # Email (Nodemailer)
    SMTP_HOST=your_smtp_host
    SMTP_PORT=your_smtp_port
    SMTP_USER=your_smtp_user
    SMTP_PASS=your_smtp_password

    # Admin dashboard password
    ADMIN_PASSWORD=your_secure_password_here
    SECRET_COOKIE_PASSWORD=a_very_long_and_secure_secret_for_sessions_at_least_32_characters

    # Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

## Project Structure

The project follows the standard Next.js App Router structure:

-   `src/app/`: Contains all the routes, pages, and layouts.
-   `src/components/`: Shared React components.
    -   `common/`: General-purpose components (Header, Footer, etc.).
    -   `sections/`: Components for different sections of the homepage.
    -   `ui/`: ShadCN UI components.
-   `src/lib/`: Utility functions and data sources (e.g., blog posts from Firestore).
-   `src/actions/`: Server Actions for form submissions and authentication.
-   `src/ai/`: Genkit flows for AI functionality.

## SEO Configuration

This project is set up for excellent SEO out of the box.

-   **Metadata:** Default metadata is configured in `src/app/layout.tsx`. For the best results, individual pages and dynamic blog posts should have their own specific metadata.
-   **Sitemap:** A `sitemap.xml` file is generated to guide search engines. Note: The current sitemap is static. For a fully dynamic sitemap that includes all Firestore blog posts, you would need to implement a server-side route that fetches and generates the XML.
-   **Robots.txt:** A `robots.txt` file is generated to guide search engine crawlers.
-   **JSON-LD:** The homepage includes structured data for your organization to improve how search engines display your information.

**Important:** Before deploying, be sure to change the `metadataBase` URL in `src/app/layout.tsx`, the `baseUrl` in `src/app/sitemap.ts`, and the placeholder data in the `jsonLd` object in `src/app/page.tsx` to your actual production domain and information.

## Deployment

This application is configured for easy deployment on **Firebase App Hosting**. Simply connect your repository to a Firebase App Hosting backend to deploy.

The `apphosting.yaml` file contains basic configuration for the deployment.

---

This starter was created to provide a solid foundation for building beautiful and performant websites. Happy coding!
