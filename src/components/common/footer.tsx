import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";
import { AnimatedGradient } from "./animated-gradient";

export function Footer() {
  return (
    <footer className="relative min-h-screen overflow-hidden bg-foreground py-20 text-background md:min-h-0 md:py-32">
      <AnimatedGradient className="opacity-20 dark:opacity-10" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between space-y-12 md:col-span-2 lg:col-span-2">
            <h3 className="font-headline text-3xl font-semibold md:text-4xl">
              Do it once. Do it right.
            </h3>
            <div className="flex flex-wrap gap-12">
              <div className="space-y-3">
                <h4 className="text-sm text-background/70">New Business:</h4>
                <a
                  href="mailto:hello@elysium.com"
                  className="text-lg transition-colors hover:text-background/80"
                >
                  hello@elysium.com
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
                  href="https://instagram.com/elysium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 transition-colors hover:text-background/80"
                >
                  Instagram{" "}
                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/elysium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 transition-colors hover:text-background/80"
                >
                  LinkedIn{" "}
                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
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

        <div className="mt-24 flex flex-col justify-between gap-4 border-t border-background/20 pt-8 text-sm text-background/70 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} The Elysium Project</p>
          <Link href="#" className="transition-colors hover:text-background/80">
            Terms of Use
          </Link>
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
