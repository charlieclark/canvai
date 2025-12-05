import { render } from "@react-email/render";
// import { sendEmail } from "../shared";
// import { type Page, type Business } from "@prisma/client";
// import PhishingAlertEmail from "../PhishingAlertEmail";

import { db } from "@/server/db";

import WaitlistAdded, { getSubject } from "../emails/WaitlistAdded";
import { sendEmail } from "../utils/shared";

type Props = {
  id: string;
};

export async function sendWaitlistAdded({ id }: Props) {
  const waitlistSignup = await db.waitlistSignup.findUniqueOrThrow({
    where: { id },
  });

  const html = await render(
    WaitlistAdded({
      name: waitlistSignup.name || `@${waitlistSignup.username}`,
      avatarImageUrl: waitlistSignup.avatarImageUrl!,
    }),
  );

  const subject = getSubject();

  await sendEmail({
    to: waitlistSignup.email,
    html,
    subject,
  });
}
