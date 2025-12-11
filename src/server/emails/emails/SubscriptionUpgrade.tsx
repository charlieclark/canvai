import { Text, Button, Section, Row, Column } from "@react-email/components";
import * as React from "react";
import Wrapper from "../components/Wrapper";
import ContentContainer from "../components/ContentContainer";
import { getBaseProductionUrl } from "@/lib/utils/urls";

export type Props = {
  userEmail: string;
};

export function getSubject() {
  return `🎉 Welcome to CanvAi Pro!`;
}

export default function SubscriptionUpgrade({ userEmail }: Props) {
  const dashboardUrl = `${getBaseProductionUrl()}/dashboard`;
  const billingUrl = `${getBaseProductionUrl()}/dashboard/billing`;

  // Extract name from email (before @) for a friendlier greeting
  const userName = userEmail.split("@")[0];

  return (
    <Wrapper
      headerText="Welcome to CanvAi Pro!"
      previewText="Your subscription is now active. Start generating with your 200 monthly credits!"
    >
      <ContentContainer>
        <Section className="mb-4">
          <Text className="mb-4 text-base text-gray-900">
            Hey {userName}, thanks for subscribing to CanvAi Pro! Your
            subscription is now active and you&apos;re ready to start creating.
          </Text>

          <div className="mb-6 rounded-lg bg-violet-50 p-6">
            <Text className="mb-2 text-lg font-semibold text-violet-900">
              ✨ Your Pro Benefits
            </Text>
            <ul className="list-none space-y-2 text-sm text-violet-800">
              <li className="flex items-center">
                <span className="mr-2">🎨</span>
                200 image generation credits per month
              </li>
              <li className="flex items-center">
                <span className="mr-2">🔄</span>
                Credits refresh every billing cycle
              </li>
              <li className="flex items-center">
                <span className="mr-2">🛡️</span>
                Cancel anytime, no questions asked
              </li>
            </ul>
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-6">
            <Text className="mb-2 text-lg font-semibold text-gray-900">
              🚀 Get Started
            </Text>
            <Text className="text-sm text-gray-700">
              Head to your dashboard to start generating images. Each generation
              uses 1 credit, and failed generations are automatically refunded.
            </Text>
          </div>

          <Row>
            <Column align="center">
              <Button
                href={dashboardUrl}
                className="rounded-md bg-violet-600 px-6 py-3 font-medium text-white"
              >
                Start Creating
              </Button>
            </Column>
          </Row>
        </Section>

        <Section className="mt-4">
          <Text className="text-sm text-gray-600">
            You can manage your subscription anytime from the{" "}
            <a href={billingUrl} className="text-violet-600 underline">
              billing page
            </a>
            . If you have any questions, just reply to this email!
          </Text>
        </Section>
      </ContentContainer>
    </Wrapper>
  );
}

const PreviewProps: Props = {
  userEmail: "user@example.com",
};

SubscriptionUpgrade.PreviewProps = PreviewProps;

