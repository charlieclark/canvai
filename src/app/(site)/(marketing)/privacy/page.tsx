import { PageContainer } from "@/components/shared/page-container";

export const metadata = {
  title: "Privacy Policy | CanvAI",
  description: "Learn about how we handle and protect your data.",
};

export default function PrivacyPage() {
  return (
    <PageContainer
      title="Privacy Policy"
      description="We take your privacy seriously. Learn about how we collect, use, and protect your personal information."
    >
      <h2>Information We Collect</h2>
      <p>We collect information that you provide directly to us, including:</p>
      <ul>
        <li>Account information (name, email, password)</li>
        <li>Profile information</li>
        <li>Content you create and upload</li>
        <li>Communication preferences</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain our services</li>
        <li>Process your transactions</li>
        <li>Send you technical notices and updates</li>
        <li>Respond to your comments and questions</li>
        <li>Analyze usage patterns and improve our services</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties.
        We may share your information in the following circumstances:
      </p>
      <ul>
        <li>With your consent</li>
        <li>To comply with legal obligations</li>
        <li>To protect our rights and safety</li>
        <li>With service providers who assist in our operations</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect
        your personal information against unauthorized access, alteration,
        disclosure, or destruction.
      </p>

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Object to data processing</li>
        <li>Export your data</li>
      </ul>

      <h2>Cookie Policy</h2>
      <p>
        We use cookies and similar technologies to enhance your experience. Please
        refer to our Cookie Policy for more information.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. We will notify you of
        any changes by posting the new policy on this page and updating the
        effective date.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        through our contact page.
      </p>
    </PageContainer>
  );
} 