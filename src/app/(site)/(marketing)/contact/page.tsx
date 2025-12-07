import { PageContainer } from "@/components/shared/page-container";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Contact | CanvAi",
  description: "Get in touch with the CanvAi team.",
};

export default function ContactPage() {
  return (
    <PageContainer
      title="Contact Us"
      description="Have questions, feedback, or just want to say hi? We'd love to hear from you."
    >
      <h2>Email Us</h2>
      <div className="not-prose mb-8 flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <a
            href="mailto:hello@canvai.co"
            className="text-lg font-medium text-primary hover:underline"
          >
            hello@canvai.co
          </a>
        </div>
      </div>

      <h2>What We Can Help With</h2>
      <ul>
        <li>
          <strong>General Inquiries:</strong> Questions about CanvAi, how it
          works, or getting started
        </li>
        <li>
          <strong>Technical Support:</strong> Issues with your account, canvas,
          or generations
        </li>
        <li>
          <strong>Feedback & Suggestions:</strong> Ideas for new features or
          improvements
        </li>
        <li>
          <strong>Business Inquiries:</strong> Partnership opportunities or
          enterprise needs
        </li>
      </ul>

      <h2>Response Time</h2>
      <p>
        We aim to respond to all inquiries within 24–48 hours during business
        days. For urgent matters, please include &quot;Urgent&quot; in your
        email subject line.
      </p>

      <h2>Follow Us</h2>
      <p>
        Stay updated on new features and announcements by following us on social
        media. Links are in the footer below.
      </p>
    </PageContainer>
  );
}
