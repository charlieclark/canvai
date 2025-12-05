import { render } from "@react-email/render";
// import { sendEmail } from "../shared";
// import { type Page, type Business } from "@prisma/client";
// import PhishingAlertEmail from "../PhishingAlertEmail";

import { db } from "@/server/db";

import WaitlistReceived, { getSubject } from "../emails/WaitlistReceived";
import { sendEmail } from "../utils/shared";

type Props = {
  id: string;
};

export async function sendWaitlistReceived({ id }: Props) {
  const waitlistSignup = await db.waitlistSignup.findUniqueOrThrow({
    where: { id },
  });

  const html = await render(
    WaitlistReceived({
      name: waitlistSignup.name!,
    }),
  );

  const subject = getSubject();

  await sendEmail({
    to: waitlistSignup.email,
    html,
    subject,
  });
}
