import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Privacy Policy</CardTitle>
           <CardDescription className="text-lg text-muted-foreground pt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground/90 leading-relaxed prose prose-sm sm:prose-base max-w-none">
          <p>
            Welcome to Tool Hub. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our tools. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h2 className="text-xl font-semibold font-headline text-primary">1. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, that you voluntarily give to us when you contact us or use certain features of our tools (e.g., if a tool requires an email to send results).</li>
            <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site. For most of our tools, data processed (e.g., images for PDF conversion) is processed client-side or temporarily on our servers and not stored long-term.</li>
          </ul>

          <h2 className="text-xl font-semibold font-headline text-primary">2. Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Operate and manage our tools and services.</li>
            <li>Respond to your comments, questions, and provide customer service.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Compile anonymous statistical data and analysis for use internally.</li>
          </ul>

          <h2 className="text-xl font-semibold font-headline text-primary">3. Disclosure of Your Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
          </p>
          
          <h2 className="text-xl font-semibold font-headline text-primary">4. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2 className="text-xl font-semibold font-headline text-primary">5. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-xl font-semibold font-headline text-primary">6. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us through our contact page or at: <a href="mailto:privacy@toolhub.example.com" className="text-primary hover:underline">privacy@toolhub.example.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
