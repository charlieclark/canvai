import { Text, Section, Button, Row, Column } from "@react-email/components";
import * as React from "react";
import Wrapper from "../components/Wrapper";
import ContentContainer from "../components/ContentContainer";
import { getBaseProductionUrl } from "@/lib/utils/urls";

export type Props = {
  name: string;
};

export function getSubject() {
  return `🎉 You're on the waitlist!`;
}

export default function WaitlistReceived({ name }: Props) {
  return (
    <Wrapper
      headerText={`Welcome to the Waitlist!`}
      previewText={`Congratulations ${name}! You've been added to the waitlist and we're working on your avatar.`}
    >
      <ContentContainer>
        <Text className="mb-4 text-base text-gray-900">
          Congratulations {name}! You've been added to the waitlist and we're
          working on your avatar.
        </Text>

        <Section className="mb-4 rounded-lg bg-indigo-50 p-6">
          <Text className="mb-4 text-lg font-semibold text-indigo-900">
            🎯 What's Next?
          </Text>
          <Text className="mb-4 text-sm text-indigo-800">
            We're currently generating your unique avatar, which should be ready
            within 24 hours. Once it's ready, we'll send you another email with
            instructions on how to view and download it.
          </Text>
          <Text className="mb-4 text-sm text-indigo-800">
            In the meantime, feel free to explore our platform and get to know
            other members of the community.
          </Text>
          <Row className="mt-6">
            <Column align="center">
              <Button
                href={`${getBaseProductionUrl()}/waitlist`}
                className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white"
              >
                Explore the Waitlist
              </Button>
            </Column>
          </Row>
        </Section>

        <Text className="text-sm text-gray-600">
          Need help or have questions? Our support team is here to help! Just
          reply to this email or contact us at hello@nano-canvas.com
        </Text>
      </ContentContainer>
    </Wrapper>
  );
}

const PreviewProps: Props = {
  name: "@johndoe",
};

WaitlistReceived.PreviewProps = PreviewProps;
