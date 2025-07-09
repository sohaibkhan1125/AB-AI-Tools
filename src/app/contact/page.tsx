'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Contact Us</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            We'd love to hear from you! Send us a message with any questions or feedback regarding AB AI Tools Hub.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="name" className="font-medium">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="email" className="font-medium">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="subject" className="font-medium">Subject</Label>
              <Input id="subject" type="text" placeholder="Regarding AB AI Tools Hub..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message" className="font-medium">Message</Label>
              <Textarea id="message" placeholder="Your message here..." rows={5} className="mt-1" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <MessageSquare className="mr-2 h-5 w-5" /> Send Message
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center">
            Alternatively, you can reach us at <a href="mailto:support@ab-ai-tools-hub.example.com" className="text-primary hover:underline">support@ab-ai-tools-hub.example.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
