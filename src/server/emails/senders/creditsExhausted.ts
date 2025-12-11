import { db } from "@/server/db";
import { render } from "@react-email/components";
import CreditsExhausted, {
  getSubject,
  type Props,
} from "../emails/CreditsExhausted";
import { sendEmail } from "../utils/shared";

type Config = {
  userId: string;
};

export default async function sendCreditsExhaustedEmail({ userId }: Config) {
  const user = await db.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  // Get the user's last 3 completed generations with images
  const generations = await db.generation.findMany({
    where: {
      project: {
        userId: userId,
      },
      status: "COMPLETED",
      imageUrl: { not: null },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    select: {
      imageUrl: true,
      prompt: true,
    },
  });

  const config: Props = {
    userEmail: user.email,
    generations: generations
      .filter((g) => g.imageUrl !== null)
      .map((g) => ({
        imageUrl: g.imageUrl!,
        prompt: g.prompt,
      })),
  };

  const html = await render(CreditsExhausted(config));

  // Record the notification to prevent sending duplicates
  await db.emailNotification.create({
    data: {
      userId,
      type: "CREDITS_EXHAUSTED",
    },
  });

  await sendEmail({
    to: user.email,
    subject: getSubject(),
    html,
  });
}
