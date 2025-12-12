import { db } from "@/server/db";
import sendCreditsExhaustedEmail from "@/server/emails/senders/creditsExhausted";

export async function GET() {
  // Find free users with 0 credits who haven't received this email yet
  const freeUsersWithNoCredits = await db.user.findMany({
    where: {
      plan: "FREE",
      credits: { lte: 0 },
      // Ensure they've actually used the product (have at least one completed generation)
      projects: {
        some: {
          generations: {
            some: {
              status: "COMPLETED",
            },
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (freeUsersWithNoCredits.length === 0) {
    return Response.json({ message: "No users to notify", count: 0 });
  }

  // Filter out users who have already received this notification
  const userIds = freeUsersWithNoCredits.map((u) => u.id);
  const alreadyNotified = await db.emailNotification.findMany({
    where: {
      userId: { in: userIds },
      type: "CREDITS_EXHAUSTED",
    },
    select: {
      userId: true,
    },
  });

  const alreadyNotifiedIds = new Set(alreadyNotified.map((n) => n.userId));
  const usersToNotify = freeUsersWithNoCredits
    .filter((u) => !alreadyNotifiedIds.has(u.id))
    // send max 5
    .slice(0, 5);

  if (usersToNotify.length === 0) {
    return Response.json({
      message: "All eligible users already notified",
      count: 0,
    });
  }

  // Send emails to eligible users
  const results = await Promise.allSettled(
    usersToNotify.map((user) => sendCreditsExhaustedEmail({ userId: user.id })),
  );

  const successCount = results.filter((r) => r.status === "fulfilled").length;
  const failedCount = results.filter((r) => r.status === "rejected").length;

  return Response.json({
    message: `Sent ${successCount} emails, ${failedCount} failed`,
    successCount,
    failedCount,
    totalEligible: usersToNotify.length,
  });
}
