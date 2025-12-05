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
  name: string;
  avatarImageUrl: string;
};

export function getSubject() {
  return `🎉 Your avatar is ready!`;
}

export default function WaitlistAdded({ name, avatarImageUrl }: Props) {
  return (
    <Wrapper
      headerText={`Your avatar is ready!`}
      previewText={`Congratulations ${name}! Your avatar is ready and you've been added to the nano-canvas.com waitlist grid.`}
    >
      <ContentContainer>
        <Row className="my-4">
          <Column align="center">
            <div className="rounded-full border-4 border-indigo-100 p-1">
              <Img
                src={avatarImageUrl}
                alt={`${name}'s avatar`}
                className="h-32 w-32 rounded-full"
              />
            </div>
          </Column>
        </Row>

        <Text className="mb-4 text-base text-gray-900">
          Congratulations {name}! Your avatar is ready and you've been added to
          the nano-canvas.com waitlist grid. This is your chance to download your
          avatar and share it with the world.
        </Text>

        <Row className="mb-6">
          <Column align="center">
            <Button
              href={`${getBaseProductionUrl()}/waitlist?avatar=${name}`}
              className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white"
            >
              View Your Avatar
            </Button>
          </Column>
        </Row>

        <Section className="mb-4 rounded-lg bg-indigo-50 p-6">
          <Text className="mb-4 text-lg font-semibold text-indigo-900">
            🎯 How to Download Your Avatar
          </Text>
          <Text className="mb-4 text-sm text-indigo-800">
            1. Click the button above to view your profile in the grid
          </Text>
          <Text className="mb-4 text-sm text-indigo-800">
            2. Click on your avatar in the grid
          </Text>
          <Text className="mb-4 text-sm text-indigo-800">
            3. Click the download button that appears
          </Text>
          <Img
            src={`${getBaseProductionUrl()}/email/waitlist.gif`}
            alt="How to download your avatar"
            className="w-full rounded-lg border border-indigo-100"
          />
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
  avatarImageUrl: "http://localhost:3000/charlie/1.png",
};

WaitlistAdded.PreviewProps = PreviewProps;
