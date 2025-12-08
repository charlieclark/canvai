import * as React from "react";
import {
  Section,
  Text,
  Row,
  Column,
  Html,
  Tailwind,
  Link,
  Head,
  Font,
  Body,
  Preview,
} from "@react-email/components";

const LOGO_TEXT = "CanvAi";
const FOOTER_TAGLINE = "AI-powered image generation for creators";
const FOOTER_ADDRESS = "335 Carroll St, Brooklyn, NY";
const UNSUBSCRIBE_URL_PLACEHOLDER = "{{{RESEND_UNSUBSCRIBE_URL}}}";
const UNSUBSCRIBE_TEXT = "Unsubscribe";
const BRAND_COLOR = "#007291";
const FONT_FAMILY_PRIMARY = "Roboto";
const FONT_FAMILY_FALLBACK = "Verdana";
const FONT_URL = "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2";
const FONT_FORMAT = "woff2";

function Header({ headerText }: { headerText: string }) {
  return (
    <Section className="px-[32px] py-[40px]">
      <Row>
        <Column align="center">
          <Text className="m-0 text-2xl font-bold text-gray-900">{LOGO_TEXT}</Text>
        </Column>
      </Row>
      <Row className="mt-[40px]">
        <Column align="center">
          {/* <table>
            <tr>
              <td className="px-[8px]">
                <Link className="text-gray-600 [text-decoration:none]" href="#">
                  About
                </Link>
              </td>
              <td className="px-[8px]">
                <Link className="text-gray-600 [text-decoration:none]" href="#">
                  Blog
                </Link>
              </td>
              <td className="px-[8px]">
                <Link className="text-gray-600 [text-decoration:none]" href="#">
                  Company
                </Link>
              </td>
              <td className="px-[8px]">
                <Link className="text-gray-600 [text-decoration:none]" href="#">
                  Features
                </Link>
              </td>
            </tr>
          </table> */}
          <Text className="m-0 text-xl text-gray-600">{headerText}</Text>
        </Column>
      </Row>
    </Section>
  );
}

function Footer({ showUnsubscribe }: { showUnsubscribe?: boolean }) {
  return (
    <Section className="my-[40px] text-center">
      <table className="w-full">
        <tr className="w-full">
          <td align="center">
            <Text className="my-[8px] text-[14px] leading-[24px] font-semibold text-gray-900">
              {FOOTER_TAGLINE}
            </Text>
          </td>
        </tr>
        {/* <tr>
          <td align="center">
            <Row className="table-cell h-[44px] w-[56px] align-bottom">
              <Column className="pr-[8px]">
                <Link href="https://x.com/colorsofmotion">
                  <Img
                    alt="X"
                    height="36"
                    src="https://react.email/static/x-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="https://www.instagram.com/thecolorsofmotion">
                  <Img
                    alt="Instagram"
                    height="36"
                    src="https://react.email/static/instagram-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr> */}
        <tr>
          <td align="center">
            <Text className="my-[8px] text-[12px] leading-[24px] font-semibold text-gray-500">
              {FOOTER_ADDRESS}
            </Text>
            {showUnsubscribe && (
              <Text className="my-[8px] text-[12px] leading-[24px] font-semibold text-gray-500">
                <Link
                  className="text-gray-500 underline"
                  href={UNSUBSCRIBE_URL_PLACEHOLDER}
                >
                  {UNSUBSCRIBE_TEXT}
                </Link>
              </Text>
            )}
          </td>
        </tr>
      </table>
    </Section>
  );
}

export default function Wrapper({
  children,
  previewText,
  headerText,
  showUnsubscribe,
}: React.PropsWithChildren<{
  previewText?: string;
  headerText: string;
  showUnsubscribe?: boolean;
}>) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: BRAND_COLOR,
            },
          },
        },
      }}
    >
      {previewText && <Preview>{previewText}</Preview>}
      <Html>
        <Head>
          <Font
            fontFamily={FONT_FAMILY_PRIMARY}
            fallbackFontFamily={FONT_FAMILY_FALLBACK}
            webFont={{
              url: FONT_URL,
              format: FONT_FORMAT,
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Body className="bg-gray-100 font-sans text-base">
          <Header headerText={headerText} />
          <Section className="p-[10px]">{children}</Section>
          <Footer showUnsubscribe={showUnsubscribe} />
        </Body>
      </Html>
    </Tailwind>
  );
}
