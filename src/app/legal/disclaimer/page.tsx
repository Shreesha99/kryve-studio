import { Metadata } from 'next';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { AnimateOnScroll } from '@/components/common/animate-on-scroll';
import { ClientDate } from '@/components/common/client-date';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for the website and services of The Elysium Project.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <AnimateOnScroll>
          <article className="container mx-auto max-w-4xl px-4 py-16 pt-32 md:px-6 md:py-24 md:pt-40">
            <h1 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Disclaimer
            </h1>
            <p className="mt-4 text-muted-foreground">Last updated: <ClientDate /></p>
            
            <div className="prose prose-lg dark:prose-invert mx-auto mt-12 max-w-none [&_h2]:font-headline [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:leading-relaxed [&_a]:text-primary hover:[&_a]:underline">
                <p>
                    The information provided by The Elysium Project ("we," "us," or "our") on https://www.the-elysium-project.in/ (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                </p>

                <h2>1. No Professional Advice</h2>
                <p>
                    The information contained on this website is not intended as, and shall not be understood or construed as, professional advice. While the employees and/or owners of the company are professionals and the information provided on this website relates to issues within the company’s area of professionalism, the information contained on this website is not a substitute for advice from a professional who is aware of the facts and circumstances of your individual situation.
                </p>

                <h2>2. External Links Disclaimer</h2>
                <p>
                    The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE.
                </p>
                
                <h2>3. Limitation of Liability</h2>
                <p>
                    UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
                </p>

                <h2>4. Testimonials Disclaimer</h2>
                <p>
                    The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences. YOUR INDIVIDUAL RESULTS MAY VARY.
                </p>

                <h2>5. Errors and Omissions Disclaimer</h2>
                <p>
                    While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, The Elysium Project is not responsible for any errors or omissions or for the results obtained from the use of this information.
                </p>
                
                <h2>6. Contact Us</h2>
                <p>
                    Should you have any feedback, comments, requests for technical support or other inquiries, please contact us by email: <a href="mailto:hello@the-elysium-project.in">hello@the-elysium-project.in</a>.
                </p>
            </div>
          </article>
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
