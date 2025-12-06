import { env } from "@/env";
import { addMinutes, isAfter } from "date-fns";
import { type CreateEmailOptions, Resend } from "resend";
import { db } from "@/server/db";
import { queueEmail } from "./queue";
import { omit } from "lodash";

const BASE_EMAIL = "hello@nano-canvas.com";
export const resend = new Resend(env.RESEND_API_KEY);
const AUDIENCE_ID = "9ac7c055-7aea-431f-ab45-5fd4ad0b7734";

const baseOptions = {
  from: "CanvAI Team <hello@mail.nano-canvas.com>",
  replyTo: BASE_EMAIL,
  bcc: BASE_EMAIL,
};

const getBaseOptions = (to: string) => {
  const isSelfSending = to === BASE_EMAIL;
  return isSelfSending ? omit(baseOptions, "bcc") : baseOptions;
};

export const sendEmail = async (email: {
  to: string;
  html: string;
  subject: string;
}) => {
  const options: CreateEmailOptions = {
    ...getBaseOptions(email.to),
    to: email.to,
    subject: email.subject,
    html: email.html,
  };
  if (env.NODE_ENV === "production") {
    await resend.emails.send(options);
  } else {
    console.info("Development mode - email:", options);
  }
};

export const sendDebouncedEmail = async ({
  to,
  html,
  subject,
  userId,
  type,
  debounceMinutes = 30,
}: {
  to: string;
  html: string;
  subject: string;
  userId: string;
  type: string;
  debounceMinutes?: number;
}) => {
  // Check if we've sent an email recently
  const lastNotification = await db.emailNotification.findFirst({
    where: {
      userId,
      type,
    },
    orderBy: {
      sentAt: "desc",
    },
  });

  const now = new Date();

  if (
    lastNotification &&
    !isAfter(now, addMinutes(lastNotification.sentAt, debounceMinutes))
  ) {
    // Skip sending if within debounce window
    return;
  }

  // Queue the email
  await queueEmail({ to, html, subject, userId });

  // Record the notification
  await db.emailNotification.create({
    data: {
      userId,
      type,
    },
  });
};

// export const sendBroadcastEmail = async ({
//   subject,
//   html,
// }: {
//   subject: string;
//   html: string;
// }) => {
//   const { data } = await resend.broadcasts.create({
//     ...baseOptions,
//     audienceId: AUDIENCE_ID,
//     subject,
//     html,
//   });

//   if (!data) {
//     throw new Error("Failed to create broadcast");
//   }

//   // Send broadcast now
//   await resend.broadcasts.send(data.id, {});
// };

export const addContact = async ({
  email,
  name,
}: {
  email: string;
  name?: string;
}) => {
  await resend.contacts.create({
    email,
    firstName: name,
    unsubscribed: false,
    audienceId: AUDIENCE_ID,
  });
};
