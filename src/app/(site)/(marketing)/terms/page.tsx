import { PageContainer } from "@/components/shared/page-container";

export const metadata = {
  title: "Terms of Service | CanvAi",
  description: "Read our terms of service and user agreement.",
};

export default function TermsPage() {
  return (
    <PageContainer
      title="Terms of Service"
      description="Please read these terms carefully before using CanvAi."
    >
      <p className="text-sm text-muted-foreground">
        Last updated: December 2024
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using CanvAi (&quot;the Service&quot;), you accept and
        agree to be bound by these Terms of Service. If you do not agree to
        these terms, please do not use our Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        CanvAi provides an infinite canvas workspace for creating AI-generated
        artwork. Users can sketch, compose frames, and generate images using
        AI models powered by Replicate. The Service requires users to provide
        their own Replicate API key for image generation.
      </p>

      <h2>3. User Accounts</h2>
      <p>To use CanvAi, you must:</p>
      <ul>
        <li>Create an account with accurate and complete information</li>
        <li>Be at least 13 years of age</li>
        <li>Maintain the security of your account credentials</li>
        <li>Provide your own valid Replicate API key for AI generations</li>
        <li>
          Accept responsibility for all activities under your account
        </li>
      </ul>

      <h2>4. API Keys and Third-Party Services</h2>
      <p>
        CanvAi integrates with Replicate for AI image generation. By using the
        Service:
      </p>
      <ul>
        <li>
          You are responsible for obtaining and managing your own Replicate API
          key
        </li>
        <li>
          Usage costs from Replicate are billed directly to you by Replicate
        </li>
        <li>
          You agree to comply with Replicate&apos;s terms of service and
          acceptable use policies
        </li>
        <li>
          CanvAi is not responsible for any charges incurred through your
          Replicate usage
        </li>
      </ul>

      <h2>5. User Content</h2>
      <p>
        You retain ownership of the content you create on CanvAi, including
        sketches, compositions, and generated images. By using the Service, you
        grant us a limited license to store and process your content as
        necessary to provide the Service.
      </p>

      <h2>6. Prohibited Content and Use</h2>
      <p>You agree not to use CanvAi to create or generate:</p>
      <ul>
        <li>
          <strong>Illegal Content:</strong> Material that violates any
          applicable law
        </li>
        <li>
          <strong>Harmful Content:</strong> Content promoting violence, self-harm,
          or dangerous activities
        </li>
        <li>
          <strong>CSAM:</strong> Any content depicting minors in inappropriate
          contexts
        </li>
        <li>
          <strong>Non-consensual Content:</strong> Deepfakes or explicit imagery
          of real people without consent
        </li>
        <li>
          <strong>Hate Speech:</strong> Content promoting discrimination or
          harassment
        </li>
        <li>
          <strong>Malicious Content:</strong> Spam, phishing, or deceptive
          material
        </li>
        <li>
          <strong>Copyright Infringement:</strong> Unauthorized reproduction of
          copyrighted works
        </li>
      </ul>
      <p>
        We reserve the right to remove content and terminate accounts that
        violate these restrictions.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        The CanvAi platform, including its design, features, and underlying
        technology, is owned by us and protected by intellectual property laws.
        You may not copy, modify, or reverse engineer any part of the Service.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The Service is provided &quot;as is&quot; without warranties of any
        kind. We do not guarantee that the Service will be uninterrupted,
        error-free, or meet your specific requirements. AI-generated content
        may not always produce expected results.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, CanvAi shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages,
        including loss of data or profits, arising from your use of the Service.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. We will notify users of
        significant changes via email or through the Service. Continued use
        after changes constitutes acceptance of the new terms.
      </p>

      <h2>11. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your access to the Service
        at any time for violation of these terms or for any other reason at our
        discretion.
      </p>

      <h2>12. Contact</h2>
      <p>
        If you have questions about these Terms, please contact us at{" "}
        <a href="mailto:hello@canvai.co" className="text-primary hover:underline">
          hello@canvai.co
        </a>
        .
      </p>
    </PageContainer>
  );
}
