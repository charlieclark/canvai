import { PageContainer } from "@/components/shared/page-container";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Contact Us | Boilerplate",
  description: "Get in touch with us for any questions or concerns.",
};

export default function ContactPage() {
  return (
    <PageContainer
      title="Contact Us"
      description="Have questions? We'd love to hear from you."
    >
      <div className="flex items-center gap-2 text-lg">
        <Mail className="h-5 w-5" />
        <a
          href="mailto:hello@nano-canvas.com"
          className="font-medium text-primary hover:underline"
        >
          hello@nano-canvas.com
        </a>
      </div>
      <p className="mt-4 text-muted-foreground">
        We aim to respond to all inquiries within 24-48 hours during business
        days. For urgent matters, please include &quot;Urgent&quot; in your
        email subject line.
      </p>
    </PageContainer>
  );
}
