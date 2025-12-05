import { Column, Hr, Row } from "@react-email/components";
import { type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = {
  noDivider?: boolean;
  label?: string;
} & PropsWithChildren;

export default function Value({ label, children, noDivider }: Props) {
  return (
    <>
      <Row>
        {label && (
          <Column className={"px-[20px] py-[8px]"}>
            <div
              className={cn("m-0 text-[14px]", !!label ? "text-gray-500" : "")}
            >
              {label}
            </div>
          </Column>
        )}
        <Column className={"px-[20px] py-[8px]"}>
          <div className={cn("m-0 text-[14px]", !!label ? "text-right" : "")}>
            {children}
          </div>
        </Column>
      </Row>
      {!noDivider && <Hr className="m-0" />}
    </>
  );
}
