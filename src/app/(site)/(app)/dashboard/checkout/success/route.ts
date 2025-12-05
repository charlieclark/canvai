import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export type SearchParams = {
  checkout: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const { checkout: checkoutId } = Object.fromEntries(
    searchParams.entries(),
  ) as SearchParams;

  await api.billing.confirmCheckout({ checkoutId });

  redirect("/dashboard/credits");
}
