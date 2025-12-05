import { PageContainer } from "@/components/shared/page-container";

export const metadata = {
  title: "Cookie Policy | Boilerplate",
  description: "Learn about how we use cookies on our website.",
};

export default function CookiesPage() {
  return (
    <PageContainer
      title="Cookie Policy"
      description="Understanding how and why we use cookies on Boilerplate"
    >
      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files that are placed on your device when you visit
        our website. They help us provide you with a better experience and allow
        certain features to work.
      </p>

      <h2>How We Use Cookies</h2>
      <p>We use cookies for the following purposes:</p>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> Required for the website to function
          properly
        </li>
        <li>
          <strong>Authentication Cookies:</strong> Remember your login status and
          preferences
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Help us understand how visitors use
          our website
        </li>
        <li>
          <strong>Functionality Cookies:</strong> Remember your preferences and
          settings
        </li>
      </ul>

      <h2>Types of Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function and cannot be
        switched off. They are usually only set in response to actions made by you,
        such as logging in or filling in forms.
      </p>

      <h3>Performance Cookies</h3>
      <p>
        These cookies allow us to count visits and traffic sources so we can
        measure and improve the performance of our site.
      </p>

      <h3>Functionality Cookies</h3>
      <p>
        These cookies enable enhanced functionality and personalization, such as
        remembering your preferences.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        Most web browsers allow you to control cookies through their settings. You
        can:
      </p>
      <ul>
        <li>View cookies stored on your device</li>
        <li>Delete all or specific cookies</li>
        <li>Block cookies from being set</li>
        <li>Allow or block cookies from specific websites</li>
      </ul>

      <h2>Third-Party Cookies</h2>
      <p>
        Some of our pages may contain content from other sites, like embedded
        videos or social media links, which may set their own cookies. We do not
        control these cookies and recommend checking the privacy policies of these
        third-party sites.
      </p>

      <h2>Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. Any changes will be
        posted on this page with an updated revision date.
      </p>

      <h2>Questions?</h2>
      <p>
        If you have any questions about how we use cookies, please contact us
        through our contact page.
      </p>
    </PageContainer>
  );
} 