import {
  Text,
  Button,
  Section,
  Row,
  Column,
  Img,
} from "@react-email/components";
import * as React from "react";
import Wrapper from "../components/Wrapper";
import ContentContainer from "../components/ContentContainer";
import { getBaseProductionUrl } from "@/lib/utils/urls";

export type Props = {
  userEmail: string;
  generations: Array<{
    imageUrl: string;
    prompt: string;
  }>;
};

export function getSubject() {
  return `Your free credits are gone — but your creativity doesn't have to stop! 🎨`;
}

export default function CreditsExhausted({ userEmail, generations }: Props) {
  const upgradeUrl = `${getBaseProductionUrl()}/dashboard/billing`;

  // Extract name from email (before @) for a friendlier greeting
  const userName = userEmail.split("@")[0];

  return (
    <Wrapper
      headerText="You've Used Your Free Credits"
      previewText="Unlock unlimited creativity with CanvAi Pro — see what you've already created!"
    >
      <ContentContainer>
        <Section className="mb-4">
          <Text className="mb-4 text-base text-gray-900">
            Hey {userName}, you&apos;ve used all your free credits on CanvAi!
            But look at the amazing work you&apos;ve already created:
          </Text>

          {generations.length > 0 && (
            <div className="mb-6">
              <Text className="mb-3 text-lg font-semibold text-gray-900">
                ✨ Your Recent Creations
              </Text>
              <Row>
                {generations.map((gen, index) => (
                  <Column key={index} className="px-1" align="center">
                    <Img
                      src={gen.imageUrl}
                      width={150}
                      height={150}
                      className="rounded-lg"
                      style={{ objectFit: "cover" }}
                    />
                  </Column>
                ))}
              </Row>
            </div>
          )}

          <div className="mb-6 rounded-lg bg-violet-50 p-6">
            <Text className="mb-2 text-lg font-semibold text-violet-900">
              🚀 Upgrade to Pro
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
                <span className="mr-2">💰</span>
                Just $20/month
              </li>
            </ul>
          </div>

          <Row>
            <Column align="center">
              <Button
                href={upgradeUrl}
                className="rounded-md bg-violet-600 px-6 py-3 font-medium text-white"
              >
                Upgrade to Pro
              </Button>
            </Column>
          </Row>
        </Section>

        <Section className="mt-4">
          <Text className="text-sm text-gray-600">
            Don&apos;t let your creativity wait. Upgrade now and keep the
            momentum going!
          </Text>
        </Section>
      </ContentContainer>
    </Wrapper>
  );
}

const PreviewProps: Props = {
  userEmail: "user@example.com",
  generations: [
    {
      imageUrl: "https://placehold.co/150x150/violet/white?text=Gen+1",
      prompt: "A beautiful sunset over the mountains with vibrant colors",
    },
    {
      imageUrl: "https://placehold.co/150x150/violet/white?text=Gen+2",
      prompt: "An astronaut riding a horse on Mars",
    },
    {
      imageUrl: "https://placehold.co/150x150/violet/white?text=Gen+3",
      prompt: "A cozy cabin in a snowy forest at night",
    },
  ],
};

CreditsExhausted.PreviewProps = PreviewProps;
