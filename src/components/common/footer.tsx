import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";
import { AnimatedGradient } from "./animated-gradient";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground py-20 text-background md:py-32">
      <AnimatedGradient className="opacity-20 dark:opacity-10" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between space-y-12 md:col-span-2 lg:col-span-2">
            <h3 className="font-headline text-3xl font-semibold md:text-4xl">
              Where pixels meet purpose.
            </h3>
            <div className="flex flex-wrap gap-12">
              <div className="space-y-3">
                <h4 className="text-sm text-background/70">New Business:</h4>
                <a
                  href="mailto:hello@the-elysium-project.in"
                  className="text-lg transition-colors hover:text-background/80"
                >
                  hello@the-elysium-project.in
                </a>
              </div>
              <NewsletterForm />
            </div>
          </div>

          <div className="lg:col-start-3">
            <h4 className="mb-6 text-sm text-background/70">Navigate</h4>
            <ul className="space-y-3 text-lg">
              <li>
                <Link
                  href="#home"
                  className="transition-colors hover:text-background/80"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#work"
                  className="transition-colors hover:text-background/80"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="transition-colors hover:text-background/80"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="transition-colors hover:text-background/80"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="transition-colors hover:text-background/80"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm text-background/70">Social</h4>
            <ul className="space-y-3 text-lg">
              <li>
                <a
                  href="https://instagram.com/the_elysium_project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 transition-colors hover:text-background/80"
                >
                  <span className="relative">
                    Instagram
                    <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-background transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-[-45deg]" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/the-elysium-project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 transition-colors hover:text-background/80"
                >
                  <span className="relative">
                    LinkedIn
                    <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-background transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-[-45deg]" />
                </a>
              </li>
            </ul>
            <div className="mt-12">
              <h4 className="mb-4 text-sm text-background/70">Location</h4>
              <ul className="space-y-2 text-lg">
                <li>Bengaluru—India</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col-reverse items-center justify-between gap-6 border-t border-background/20 pt-8 text-sm text-background/70 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} The Elysium Project. All Rights Reserved. <Link href="/admin" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-background/80 underline">Admin</Link></p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <Link href="/legal/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-background/80">
                Terms of Service
                </Link>
                <Link href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-background/80">
                Privacy Policy
                </Link>
                <Link href="/legal/disclaimer" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-background/80">
                Disclaimer
                </Link>
            </div>
        </div>
      </div>

      {/* Background Brand Text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 text-center font-headline font-extrabold text-background opacity-5"
        style={{
          fontSize: "clamp(5rem, 22vw, 22rem)",
          lineHeight: "0.85",
        }}
      >
        ELYSIUM
      </div>
    </footer>
  );
}
