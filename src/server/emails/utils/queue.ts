import { db } from "@/server/db";
import { sendEmail } from "./shared";
import pLimit from "p-limit";
import { milliseconds } from "date-fns";
import { type QueuedEmail } from "@prisma/client";

const RATE_LIMIT_MS = 1000;
const limit = pLimit(2);

export const queueEmail = async ({
  to,
  html,
  subject,
  userId,
}: {
  to: string;
  html: string;
  subject: string;
  userId?: string;
}) => {
  const queuedEmail = await db.queuedEmail.create({
    data: {
      to,
      html,
      subject,
      userId,
    },
  });
  return queuedEmail;
};

const processEmail = async (email: QueuedEmail) => {
  try {
    await sendEmail(email);

    await db.queuedEmail.update({
      where: { id: email.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        attempts: { increment: 1 },
      },
    });
  } catch (error) {
    await db.queuedEmail.update({
      where: { id: email.id },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
        attempts: { increment: 1 },
      },
    });
    throw error;
  }
};

const processEmailWithRateLimit = (email: QueuedEmail) => {
  return limit(async () => {
    await processEmail(email);
    // Wait for rate limit before allowing next email
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
  });
};

export const processEmailQueue = async () => {
  // First check if there are any emails in SENDING state
  const sendingEmails = await db.queuedEmail.findFirst({
    where: {
      status: "SENDING",
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const fiveMinutesAgo = new Date(Date.now() - milliseconds({ minutes: 5 }));

  // If there's a SENDING email that's been updated in the last 5 minutes, assume another process is running
  if (sendingEmails && sendingEmails.updatedAt > fiveMinutesAgo) {
    console.info("Another email processing job is running. Skipping.");
    return;
  }

  // Mark any stale SENDING emails (older than 5 minutes) as FAILED
  await db.queuedEmail.updateMany({
    where: {
      status: "SENDING",
      updatedAt: {
        lt: fiveMinutesAgo,
      },
    },
    data: {
      status: "FAILED",
      error: "Stale SENDING email",
    },
  });

  // Get pending emails and mark them as SENDING
  const pendingEmails = await db.queuedEmail.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 100, // Process in batches
  });

  if (pendingEmails.length === 0) return;

  const pendingIds = pendingEmails.map((email) => email.id);

  // Mark these emails as SENDING
  await db.queuedEmail.updateMany({
    where: {
      id: {
        in: pendingIds,
      },
    },
    data: {
      status: "SENDING",
    },
  });

  try {
    // Process emails with rate limiting
    await Promise.allSettled(pendingEmails.map(processEmailWithRateLimit));
  } catch (error) {
    // If there's an error, mark any remaining SENDING emails as PENDING
    await db.queuedEmail.updateMany({
      where: {
        id: {
          in: pendingIds,
        },
        status: "SENDING",
      },
      data: {
        status: "PENDING",
      },
    });
    throw error;
  }

  // Process the queue again in case there are more emails to process
  await processEmailQueue();
};
