import { PageContainer } from "@/components/shared/page-container";

export const metadata = {
  title: "Terms of Service | CanvAI",
  description: "Read our terms of service and user agreement.",
};

export default function TermsPage() {
  return (
    <PageContainer
      title="Terms of Service"
      description="Please read these terms carefully before using our service."
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using CanvAI, you accept and agree to be bound by the
        terms and provision of this agreement.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        CanvAI provides a platform for creating and managing web pages. We reserve
        the right to modify, suspend, or discontinue the service at any time
        without notice.
      </p>

      <h2>3. User Responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account</li>
        <li>Comply with all applicable laws and regulations</li>
        <li>Not use the service for any illegal or unauthorized purpose</li>
      </ul>

      <h2>4. Content</h2>
      <p>
        You retain all rights to your content. By using our service, you grant us a
        license to host and display your content.
      </p>

      <h2>5. Prohibited Content</h2>
      <p>
        The following types of content and pages are strictly prohibited on our
        platform:
      </p>
      <ul>
        <li>
          <strong>Illegal Activities:</strong> Content promoting or facilitating
          illegal activities, including but not limited to drugs, weapons, or
          counterfeit goods
        </li>
        <li>
          <strong>Adult Content:</strong> Pornographic material, explicit sexual
          content, or adult services
        </li>
        <li>
          <strong>Hate Speech:</strong> Content promoting discrimination,
          harassment, or violence against individuals or groups
        </li>
        <li>
          <strong>Malicious Content:</strong> Malware, phishing attempts, or other
          harmful code
        </li>
        <li>
          <strong>Spam:</strong> Deceptive practices, scams, or unsolicited
          commercial content
        </li>
        <li>
          <strong>Copyright Infringement:</strong> Unauthorized use of copyrighted
          material, including media, software, or text
        </li>
        <li>
          <strong>Personal Information:</strong> Publishing others&apos; personal
          or confidential information without consent
        </li>
        <li>
          <strong>Impersonation:</strong> Pages that mislead or defraud by
          impersonating people or organizations
        </li>
        <li>
          <strong>Gambling:</strong> Unauthorized gambling, betting, or related
          activities
        </li>
      </ul>
      <p>
        We reserve the right to remove any content that violates these
        restrictions, suspend or terminate accounts, and report violations to
        relevant authorities. This list is not exhaustive, and we maintain
        discretion in determining inappropriate content.
      </p>

      <h2>6. Privacy</h2>
      <p>
        Your privacy is important to us. Please review our Privacy Policy to
        understand how we collect and use your information.
      </p>

      <h2>7. Termination</h2>
      <p>
        We reserve the right to terminate or suspend access to our service
        immediately, without prior notice or liability.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        CanvAI shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages resulting from your use of the service.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. We will notify
        users of any material changes via email or through the service.
      </p>

      <h2>10. Contact</h2>
      <p>
        If you have any questions about these Terms, please contact us through our
        contact page.
      </p>
    </PageContainer>
  );
} 