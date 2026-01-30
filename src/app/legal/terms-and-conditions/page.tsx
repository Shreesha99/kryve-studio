import { Metadata } from 'next';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { AnimateOnScroll } from '@/components/common/animate-on-scroll';
import { ClientDate } from '@/components/common/client-date';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Read the terms and conditions for using the website and services of The Elysium Project.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function TermsAndConditionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <AnimateOnScroll>
          <article className="container mx-auto max-w-4xl px-4 py-16 pt-32 md:px-6 md:py-24 md:pt-40">
            <h1 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Terms and Conditions
            </h1>
            <p className="mt-4 text-muted-foreground">Last updated: <ClientDate /></p>
            
            <div className="prose prose-lg dark:prose-invert mx-auto mt-12 max-w-none [&_h2]:font-headline [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:leading-relaxed [&_a]:text-primary hover:[&_a]:underline">
                <p>
                    Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the https://www.the-elysium-project.in/ website (the "Service") operated by The Elysium Project ("us", "we", or "our").
                </p>

                <p>
                    Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                </p>
                
                <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
                    <p className="font-bold text-destructive">Disclaimer: Not Legal Advice</p>
                    <p className="text-destructive/90">
                        The information provided in this document is for general informational purposes only and is not a substitute for legal advice from a qualified professional. We strongly recommend you consult with a legal expert to ensure your website's policies are fully compliant with all applicable laws in your jurisdiction.
                    </p>
                </div>

                <h2>1. Intellectual Property</h2>
                <p>
                    The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of The Elysium Project and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of The Elysium Project.
                </p>

                <h2>2. Use of Website</h2>
                <p>
                    You are granted a non-exclusive, non-transferable, revocable license to access and use our website strictly in accordance with these terms of use. As a condition of your use of the Site, you warrant to The Elysium Project that you will not use the Site for any purpose that is unlawful or prohibited by these Terms. You may not use the Site in any manner that could damage, disable, overburden, or impair the Site or interfere with any other party's use and enjoyment of the Site.
                </p>
                
                <h2>3. Links to Other Web Sites</h2>
                <p>
                    Our Service may contain links to third-party web sites or services that are not owned or controlled by The Elysium Project. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that The Elysium Project shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
                </p>

                <h2>4. Limitation of Liability</h2>
                <p>
                    In no event shall The Elysium Project, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>

                <h2>5. Indemnification</h2>
                 <p>
                    You agree to defend, indemnify and hold harmless The Elysium Project and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, or b) a breach of these Terms.
                </p>

                <h2>6. Governing Law</h2>
                <p>
                    These Terms shall be governed and construed in accordance with the laws of India, with regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. All disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
                </p>

                <h2>7. Changes</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>

                <h2>8. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us at <a href="mailto:hello@the-elysium-project.in">hello@the-elysium-project.in</a>.
                </p>
            </div>
          </article>
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
