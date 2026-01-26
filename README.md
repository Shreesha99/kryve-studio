# Zenith Studio - A Next.js Starter

Welcome to Zenith Studio, a premium, minimal starter for a digital studio website. This project is built with a modern tech stack and is designed to be easily customizable. It includes a variety of pre-built components, a blog, and a contact form, all styled with a sleek and professional design.

## Features

- **Modern Tech Stack:** Next.js 14 (App Router), React, TypeScript.
- **Styling:** Tailwind CSS and ShadCN UI for a beautiful, consistent, and customizable design system.
- **Animations:** Smooth page transitions and component animations powered by GSAP.
- **Blog:** A fully-functional blog with dynamic routing and content managed via JSON files.
- **AI-Powered Content:** Includes a Genkit flow for generating blog posts with AI.
- **Contact Form:** A working contact form that uses Nodemailer and Next.js Server Actions.
- **SEO Optimized:** Pre-configured for maximum search engine visibility with dynamic sitemaps, robots.txt, and structured metadata.

## Getting Started

### Prerequisites

- Node.js (v18.17 or later)
- npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/zenith-studio.git
    cd zenith-studio
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Set up your environment variables. Create a `.env.local` file in the root of the project and add your SMTP credentials for the contact form:
    ```
    SMTP_HOST=your_smtp_host
    SMTP_PORT=your_smtp_port
    SMTP_USER=your_smtp_user
    SMTP_PASS=your_smtp_password
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
-   `src/lib/`: Utility functions and data sources (e.g., blog posts).
-   `src/actions/`: Server Actions for form submissions.
-   `src/ai/`: Genkit flows for AI functionality.

## SEO Configuration

This project is set up for excellent SEO out of the box.

-   **Metadata:** Default metadata is configured in `src/app/layout.tsx`, and each page has its own specific metadata.
-   **Sitemap:** A `sitemap.xml` file is dynamically generated. To view it, start the dev server and visit `/sitemap.xml`.
-   **Robots.txt:** A `robots.txt` file is generated to guide search engine crawlers.

**Important:** Before deploying, be sure to change the `metadataBase` URL in `src/app/layout.tsx` and the `baseUrl` in `src/app/sitemap.ts` to your actual production domain.

## Deployment

This application is configured for easy deployment on **Firebase App Hosting**. Simply connect your repository to a Firebase App Hosting backend to deploy.

The `apphosting.yaml` file contains basic configuration for the deployment.

---

This starter was created to provide a solid foundation for building beautiful and performant websites. Happy coding!
