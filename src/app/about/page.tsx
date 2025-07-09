import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Info className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">About AB AI Tools Hub</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg text-foreground/90 leading-relaxed">
          <p>
            AB AI Tools Hub is dedicated to providing a suite of simple, free, and easy-to-use AI-powered online tools to help you with your daily digital tasks. Our goal is to create a centralized platform where you can find reliable utilities without any hassle.
          </p>
          <p>
            We believe in the power of simplicity and efficiency. Each tool on our platform is designed with the user in mind, ensuring a straightforward experience and effective results. Whether you need to generate images from text, convert files, or perform other common tasks, AB AI Tools Hub aims to be your go-to resource.
          </p>
          <p>
            Our platform is continuously evolving. We are committed to adding more useful tools and improving existing ones based on user feedback and technological advancements. We strive to maintain a high standard of quality and reliability for all our services.
          </p>
          <p>
            Thank you for choosing AB AI Tools Hub. We hope our tools make your digital life a little bit easier!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
