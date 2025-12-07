import { PageContainer } from "@/components/shared/page-container";

export const metadata = {
  title: "Cookie Policy | CanvAI",
  description: "Learn how CanvAI uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <PageContainer
      title="Cookie Policy"
      description="How we use cookies and similar technologies on CanvAI"
    >
      <p className="text-sm text-muted-foreground">
        Last updated: December 2024
      </p>

      <h2>What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help websites remember your preferences and provide a
        better user experience. We also use similar technologies like local
        storage for certain features.
      </p>

      <h2>How We Use Cookies</h2>
      <p>CanvAI uses cookies for the following purposes:</p>

      <h3>Essential Cookies</h3>
      <p>
        These cookies are necessary for CanvAI to function properly. They
        enable core features like:
      </p>
      <ul>
        <li>User authentication and session management</li>
        <li>Security features and fraud prevention</li>
        <li>Saving your canvas state and project data locally</li>
        <li>Remembering your preferences within a session</li>
      </ul>
      <p>
        <strong>These cookies cannot be disabled</strong> as they are required
        for the Service to work.
      </p>

      <h3>Functional Cookies</h3>
      <p>These cookies enhance your experience by remembering:</p>
      <ul>
        <li>Your preferred canvas settings</li>
        <li>UI preferences and layout choices</li>
        <li>Recently used tools and options</li>
      </ul>

      <h3>Analytics Cookies</h3>
      <p>
        We may use analytics cookies to understand how users interact with
        CanvAI. This helps us improve the Service. Analytics data is aggregated
        and does not personally identify you.
      </p>

      <h2>Third-Party Cookies</h2>
      <p>Some cookies are set by third-party services we use:</p>
      <ul>
        <li>
          <strong>Clerk:</strong> Authentication and session management
        </li>
        <li>
          <strong>Vercel Analytics:</strong> Anonymous usage analytics (if
          enabled)
        </li>
      </ul>
      <p>
        These providers have their own privacy and cookie policies that govern
        their use of cookies.
      </p>

      <h2>Local Storage</h2>
      <p>
        In addition to cookies, we use browser local storage to save your canvas
        work and settings. This data stays on your device and helps ensure you
        don&apos;t lose work if you close your browser.
      </p>

      <h2>Managing Cookies</h2>
      <p>You can control cookies through your browser settings:</p>
      <ul>
        <li>
          <strong>View cookies:</strong> See what cookies are stored on your
          device
        </li>
        <li>
          <strong>Delete cookies:</strong> Remove all or specific cookies
        </li>
        <li>
          <strong>Block cookies:</strong> Prevent new cookies from being set
        </li>
      </ul>
      <p>
        Note that blocking essential cookies may prevent CanvAI from working
        properly.
      </p>

      <h3>Browser-Specific Instructions</h3>
      <ul>
        <li>
          <strong>Chrome:</strong> Settings → Privacy and Security → Cookies
        </li>
        <li>
          <strong>Firefox:</strong> Settings → Privacy & Security → Cookies
        </li>
        <li>
          <strong>Safari:</strong> Preferences → Privacy → Cookies
        </li>
        <li>
          <strong>Edge:</strong> Settings → Privacy → Cookies
        </li>
      </ul>

      <h2>Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy as our use of cookies evolves. Changes
        will be posted on this page with an updated revision date.
      </p>

      <h2>Questions?</h2>
      <p>
        If you have questions about our use of cookies, contact us at{" "}
        <a href="mailto:hello@canvai.co" className="text-primary hover:underline">
          hello@canvai.co
        </a>
        .
      </p>
    </PageContainer>
  );
}
