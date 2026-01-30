import { Metadata } from 'next';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { AnimateOnScroll } from '@/components/common/animate-on-scroll';
import { ClientDate } from '@/components/common/client-date';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our Privacy Policy outlines how The Elysium Project collects, uses, and protects your personal information.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <AnimateOnScroll>
          <article className="container mx-auto max-w-4xl px-4 py-16 pt-32 md:px-6 md:py-24 md:pt-40">
            <h1 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted-foreground">Last updated: <ClientDate /></p>
            
            <div className="prose prose-lg dark:prose-invert mx-auto mt-12 max-w-none [&_h2]:font-headline [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:leading-relaxed [&_a]:text-primary hover:[&_a]:underline">
                <p>
                    The Elysium Project ("us", "we", or "our") operates the https://www.the-elysium-project.in/ website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                </p>
                <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
                    <p className="font-bold text-destructive">Disclaimer: Not Legal Advice</p>
                    <p className="text-destructive/90">
                        This document is for informational purposes only. We strongly recommend consulting with a legal expert to ensure full compliance with privacy laws applicable to your situation.
                    </p>
                </div>
                <h2>1. Information Collection and Use</h2>
                <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                <h3>Types of Data Collected</h3>
                <ul>
                    <li><strong>Personal Data:</strong> While using our Service, particularly the contact form, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Name and Email Address.</li>
                    <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.</li>
                </ul>

                <h2>2. Use of Data</h2>
                <p>The Elysium Project uses the collected data for various purposes:</p>
                <ul>
                    <li>To provide and maintain our Service</li>
                    <li>To respond to your inquiries submitted through our contact form</li>
                    <li>To monitor the usage of our Service to improve user experience</li>
                    <li>To detect, prevent and address technical issues</li>
                </ul>

                <h2>3. Data Handling for Contact Form</h2>
                <p>
                    When you submit our contact form, the information (name, email, message) is sent to our email address using a third-party service (Nodemailer) via our secure server. We do not store this information on a public database. We use this information solely for the purpose of responding to your inquiry.
                </p>

                <h2>4. Cookies</h2>
                <p>
                    Our website may use "cookies" to enhance user experience. Cookies are small files placed on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>

                <h2>5. Data Security</h2>
                <p>
                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>

                <h2>6. Your Data Protection Rights under Indian Law</h2>
                <p>
                    In accordance with the Digital Personal Data Protection Act (DPDPA) and other applicable Indian laws, you have certain data protection rights. The Elysium Project aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
                </p>

                <h2>7. Children's Privacy</h2>
                <p>
                    Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us.
                </p>
                
                <h2>8. Changes to This Privacy Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>

                <h2>9. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@the-elysium-project.in">hello@the-elysium-project.in</a>.
                </p>
            </div>
          </article>
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
