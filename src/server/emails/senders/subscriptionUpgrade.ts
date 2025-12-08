import { db } from "@/server/db";
import { render } from "@react-email/components";
import SubscriptionUpgrade, {
  getSubject,
  type Props,
} from "../emails/SubscriptionUpgrade";
import { sendEmail } from "../utils/shared";

type Config = {
  userId: string;
};

export default async function sendSubscriptionUpgradeEmail({
  userId,
}: Config) {
  const user = await db.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const config: Props = {
    userEmail: user.email,
  };

  const html = await render(SubscriptionUpgrade(config));

  await sendEmail({
    to: user.email,
    subject: getSubject(),
    html,
  });
}

