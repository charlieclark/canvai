import { Container, Heading, Hr } from "@react-email/components";
import { type PropsWithChildren } from "react";

type Props = {
  title?: string;
} & PropsWithChildren;

export default function ContentContainer({ title, children }: Props) {
  return (
    <Container className="mb-5 rounded-lg bg-white text-[14px]">
      {title && (
        <>
          <Heading as="h4" className="m-0 px-[20px] py-[16px]">
            {title}
          </Heading>
          <Hr className="m-0" />
        </>
      )}
      <Container className="px-[16px] py-[8px]">
        {children}
      </Container>
    </Container>
  );
}
