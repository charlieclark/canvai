import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import Stripe from "stripe";
import { env } from "@/env";
import { getBaseProductionUrl } from "@/lib/utils/urls";

export const stripe = new Stripe(env.STRIPE_PRIVATE_KEY);

type CheckoutMetadata = {
  userId: string;
};

export const billingRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { email } = ctx.user;
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: env.STRIPE_PRICE,
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${getBaseProductionUrl()}/dashboard/checkout/success?checkout={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: ctx.user.id,
      } as CheckoutMetadata,
      ui_mode: "embedded",
      automatic_tax: { enabled: true },
      // allow_promotion_codes: true,
    });
    return { secret: session.client_secret };
  }),

  confirmCheckout: publicProcedure
    .input(z.object({ checkoutId: z.string() }))
    .mutation(async ({ input }) => {
      const checkout = await stripe.checkout.sessions.retrieve(
        input.checkoutId,
      );

      const { userId } = checkout.metadata as CheckoutMetadata;

      if (!userId) {
        throw new Error("Missing userId in metadata");
      }
    }),
});
