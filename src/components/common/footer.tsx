import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground py-20 text-background md:py-32">
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
                  href="mailto:hello@zenith.com"
                  className="text-lg transition-colors hover:text-background/80"
                >
                  hello@zenith.com
                </a>
              </div>
              <div className="max-w-xs space-y-3">
                <h4 className="text-sm text-background/70">
                  Sign up for our newsletter (No spam)
                </h4>
                <form className="flex items-center border-b border-background/50 py-1 transition-colors focus-within:border-background">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent text-lg placeholder:text-background/50 focus:outline-none"
                  />
                  <button type="submit" aria-label="Submit email" className="transition-transform hover:translate-x-1">
                    <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-start-3">
            <h4 className="mb-6 text-sm text-background/70">Navigate</h4>
            <ul className="space-y-3 text-lg">
              <li><Link href="#home" className="transition-colors hover:text-background/80">Home</Link></li>
              <li><Link href="#work" className="transition-colors hover:text-background/80">Work</Link></li>
              <li><Link href="#about" className="transition-colors hover:text-background/80">About</Link></li>
              <li><Link href="#services" className="transition-colors hover:text-background/80">Services</Link></li>
              <li><Link href="#contact" className="transition-colors hover:text-background/80">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm text-background/70">Social</h4>
            <ul className="space-y-3 text-lg">
              <li>
                <a href="#" className="group inline-flex items-center gap-2 transition-colors hover:text-background/80">
                  Instagram <span className="text-xl transition-transform group-hover:translate-x-1">↗</span>
                </a>
              </li>
              <li>
                <a href="#" className="group inline-flex items-center gap-2 transition-colors hover:text-background/80">
                  LinkedIn <span className="text-xl transition-transform group-hover:translate-x-1">↗</span>
                </a>
              </li>
            </ul>
            <div className="mt-12">
              <h4 className="mb-4 text-sm text-background/70">Location</h4>
              <ul className="space-y-2 text-lg">
                <li>San Diego—USA</li>
                <li>Paris—France</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-24 flex flex-col justify-between gap-4 border-t border-background/20 pt-8 text-sm text-background/70 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Zenith Studio</p>
            <Link href="#" className="transition-colors hover:text-background/80">Terms of Use</Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 text-center font-headline font-extrabold text-white/5"
        style={{ fontSize: 'clamp(8rem, 25vw, 20rem)', lineHeight: '0.8' }}
      >
        ZENITH
      </div>
    </footer>
  );
}
