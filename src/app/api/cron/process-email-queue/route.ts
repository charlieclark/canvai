import { processEmailQueue } from "@/server/emails/utils/queue";
// import { verifySignature } from "@/server/cron";

export async function GET() {
  // const isValid = await verifySignature(request);
  // if (!isValid) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  await processEmailQueue();

  return new Response("OK", { status: 200 });
}
