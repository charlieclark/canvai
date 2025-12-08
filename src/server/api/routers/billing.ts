import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import Stripe from "stripe";
import { env } from "@/env";
import { getBaseProductionUrl } from "@/lib/utils/urls";
import type { db as database } from "@/server/db";

export const stripe = new Stripe(env.STRIPE_PRIVATE_KEY);

const CREDITS_PER_MONTH = 200;

type CheckoutMetadata = {
  userId: string;
};

export const billingRouter = createTRPCRouter({
  /**
   * Get the user's subscription details including credits
   */
  getSubscriptionDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    if (!user.stripeCustomerId || user.plan === "FREE") {
      return {
        status: "inactive" as const,
        plan: user.plan,
        credits: 0,
        creditsPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      limit: 1,
      status: "active",
    });

    if (subscriptions.data.length === 0) {
      return {
        status: "inactive" as const,
        plan: user.plan,
        credits: user.credits,
        creditsPeriodEnd: user.creditsPeriodEnd,
        cancelAtPeriodEnd: false,
      };
    }

    const subscription = subscriptions.data[0];
    if (!subscription) {
      return {
        status: "inactive" as const,
        plan: user.plan,
        credits: user.credits,
        creditsPeriodEnd: user.creditsPeriodEnd,
        cancelAtPeriodEnd: false,
      };
    }

    return {
      status: subscription.status,
      plan: user.plan,
      credits: user.credits,
      creditsPeriodEnd: user.creditsPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      subscriptionId: subscription.id,
    };
  }),

  /**
   * Cancel the subscription at period end
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: ctx.user.stripeCustomerId,
      limit: 1,
      status: "active",
    });

    if (subscriptions.data.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    const subscription = subscriptions.data[0];
    if (!subscription) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    return { success: true };
  }),

  /**
   * Reactivate a subscription that was scheduled for cancellation
   */
  reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: ctx.user.stripeCustomerId,
      limit: 1,
      status: "active",
    });

    if (subscriptions.data.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    const subscription = subscriptions.data[0];
    if (!subscription) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    if (!subscription.cancel_at_period_end) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Subscription is not scheduled for cancellation",
      });
    }

    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
    });

    return { success: true };
  }),

  /**
   * Create a customer portal session for managing subscription
   */
  createCustomerPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: ctx.user.stripeCustomerId,
      return_url: `${getBaseProductionUrl()}/dashboard/billing`,
    });

    return { url: session.url };
  }),

  /**
   * Create a checkout session for subscription
   */
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
      mode: "subscription",
      return_url: `${getBaseProductionUrl()}/dashboard/checkout/success?checkout={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: ctx.user.id,
      } as CheckoutMetadata,
      ui_mode: "embedded",
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
    });

    return { secret: session.client_secret };
  }),

  /**
   * Get checkout session status
   */
  getSessionStatus: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return {
        status: session.status,
        customerEmail: session.customer_details?.email,
      };
    }),

  /**
   * Confirm checkout and activate subscription with credits
   */
  confirmCheckout: publicProcedure
    .input(z.object({ checkoutId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const checkout = await stripe.checkout.sessions.retrieve(
        input.checkoutId,
      );

      const { userId } = checkout.metadata as CheckoutMetadata;

      if (!userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing userId in metadata",
        });
      }

      // Calculate period end (30 days from now)
      const creditsPeriodEnd = new Date();
      creditsPeriodEnd.setDate(creditsPeriodEnd.getDate() + 30);

      await ctx.db.user.update({
        where: { id: userId },
        data: {
          plan: "SUBSCRIBED",
          stripeCustomerId: checkout.customer as string,
          credits: CREDITS_PER_MONTH,
          creditsPeriodEnd,
        },
      });

      return { success: true };
    }),
});

/**
 * Helper function to check and refresh credits on-demand
 * Called before generation to handle subscription renewals without webhooks
 */
export async function refreshCreditsIfNeeded(
  db: typeof database,
  userId: string,
): Promise<{
  hasCredits: boolean;
  credits: number;
  plan: "FREE" | "SUBSCRIBED";
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      credits: true,
      creditsPeriodEnd: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    return { hasCredits: false, credits: 0, plan: "FREE" };
  }

  // If user is on FREE plan, no credits
  if (user.plan === "FREE") {
    return { hasCredits: false, credits: 0, plan: "FREE" };
  }

  // If credits period hasn't ended yet, return current credits
  if (user.creditsPeriodEnd && user.creditsPeriodEnd > new Date()) {
    return {
      hasCredits: user.credits > 0,
      credits: user.credits,
      plan: "SUBSCRIBED",
    };
  }

  // Period has ended - check if subscription is still active
  if (!user.stripeCustomerId) {
    // No Stripe customer, reset to FREE
    await db.user.update({
      where: { id: userId },
      data: { plan: "FREE", credits: 0, creditsPeriodEnd: null },
    });
    return { hasCredits: false, credits: 0, plan: "FREE" };
  }

  // Query Stripe for active subscription
  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    limit: 1,
    status: "active",
  });

  if (subscriptions.data.length === 0) {
    // No active subscription, reset to FREE
    await db.user.update({
      where: { id: userId },
      data: { plan: "FREE", credits: 0, creditsPeriodEnd: null },
    });
    return { hasCredits: false, credits: 0, plan: "FREE" };
  }

  // Subscription is active - reset credits for new period
  const subscription = subscriptions.data[0];
  if (!subscription) {
    return { hasCredits: false, credits: 0, plan: "FREE" };
  }

  // Get the current period end from the subscription
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const currentPeriodEnd = (subscription as any).current_period_end as number;
  const newPeriodEnd = new Date(currentPeriodEnd * 1000);

  await db.user.update({
    where: { id: userId },
    data: {
      credits: CREDITS_PER_MONTH,
      creditsPeriodEnd: newPeriodEnd,
    },
  });

  return {
    hasCredits: true,
    credits: CREDITS_PER_MONTH,
    plan: "SUBSCRIBED",
  };
}

/**
 * Deduct a credit from the user's account
 */
export async function deductCredit(
  db: typeof database,
  userId: string,
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      credits: { decrement: 1 },
    },
  });
}

/**
 * Refund a credit to the user's account (for failed generations)
 */
export async function refundCredit(
  db: typeof database,
  userId: string,
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      credits: { increment: 1 },
    },
  });
}
