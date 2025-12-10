import { PageContainer } from "@/components/shared/page-container";

export const metadata = {
  title: "Privacy Policy | CanvAi",
  description: "Learn how CanvAi collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <PageContainer
      title="Privacy Policy"
      description="We take your privacy seriously. Here's how we handle your data."
    >
      <p className="text-sm text-muted-foreground">
        Last updated: December 2024
      </p>

      <h2>Information We Collect</h2>
      <p>When you use CanvAi, we collect:</p>

      <h3>Account Information</h3>
      <ul>
        <li>Email address</li>
        <li>Name (if provided)</li>
        <li>Profile information from authentication providers (e.g., Google)</li>
      </ul>

      <h3>Content You Create</h3>
      <ul>
        <li>Canvas projects and compositions</li>
        <li>Generated images</li>
        <li>Assets you upload or create</li>
      </ul>

      <h3>Technical Information</h3>
      <ul>
        <li>Browser type and version</li>
        <li>Device information</li>
        <li>IP address</li>
        <li>Usage patterns and interactions with the Service</li>
      </ul>

      <h3>Payment Information</h3>
      <p>
        Payment processing is handled securely by Stripe. We do not store your
        full credit card details on our servers. Stripe&apos;s privacy policy
        governs the handling of your payment information.
      </p>

      <h2>How We Use Your Information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Provide and maintain the CanvAi service</li>
        <li>Process image generation requests</li>
        <li>Store and sync your projects across devices</li>
        <li>Send important service updates and notifications</li>
        <li>Improve and optimize the Service</li>
        <li>Respond to support requests</li>
        <li>Detect and prevent abuse or fraud</li>
      </ul>

      <h2>Data Sharing</h2>
      <p>We do not sell your personal information. We may share data with:</p>
      <ul>
        <li>
          <strong>AI Providers:</strong> Your prompts and image data are sent to
          our AI providers for processing, subject to their privacy policies
        </li>
        <li>
          <strong>Payment Processors:</strong> We use Stripe for secure payment
          processing
        </li>
        <li>
          <strong>Authentication Providers:</strong> We use Clerk for secure
          authentication
        </li>
        <li>
          <strong>Hosting Providers:</strong> Our infrastructure providers
          (Vercel, cloud storage) process data to deliver the Service
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law or to
          protect our rights
        </li>
      </ul>

      <h2>Data Storage and Security</h2>
      <p>
        Your data is stored on secure servers with encryption at rest and in
        transit. We implement industry-standard security measures to protect
        against unauthorized access, alteration, or destruction of your data.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain your data for as long as your account is active. If you delete
        your account, we will delete your personal data within 30 days, except
        where retention is required by law.
      </p>

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>
          <strong>Access:</strong> Request a copy of your personal data
        </li>
        <li>
          <strong>Correction:</strong> Update or correct inaccurate information
        </li>
        <li>
          <strong>Deletion:</strong> Request deletion of your data and account
        </li>
        <li>
          <strong>Export:</strong> Download your projects and generated images
        </li>
        <li>
          <strong>Objection:</strong> Object to certain processing activities
        </li>
      </ul>
      <p>
        To exercise these rights, contact us at{" "}
        <a href="mailto:hello@canvai.co" className="text-primary hover:underline">
          hello@canvai.co
        </a>
        .
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        CanvAi is not intended for children under 13. We do not knowingly
        collect personal information from children under 13. If you believe a
        child has provided us with personal information, please contact us.
      </p>

      <h2>International Data Transfers</h2>
      <p>
        Your data may be processed in countries other than your own. We ensure
        appropriate safeguards are in place for international transfers in
        compliance with applicable data protection laws.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of significant changes via email or through the Service.
      </p>

      <h2>Contact Us</h2>
      <p>
        For privacy-related questions or concerns, contact us at{" "}
        <a href="mailto:hello@canvai.co" className="text-primary hover:underline">
          hello@canvai.co
        </a>
        .
      </p>
    </PageContainer>
  );
}
