"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Coins,
  Sparkles,
  Loader2,
  Check,
  ExternalLink,
  CreditCard,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StripeCheckout } from "@/components/shared/stripe-checkout";

export default function BillingPage() {
  const { toast } = useToast();
  const [stripeCheckoutOpen, setStripeCheckoutOpen] = useState(false);

  const utils = api.useUtils();

  const { data: subscriptionDetails, isLoading: isLoadingSubscription } =
    api.billing.getSubscriptionDetails.useQuery();

  const { data: creditsStatus, isLoading: isLoadingCredits } =
    api.generation.getCreditsStatus.useQuery();

  const cancelMutation = api.billing.cancelSubscription.useMutation({
    onSuccess: () => {
      toast({
        title: "Subscription cancelled",
        description:
          "Your subscription has been cancelled. You'll retain access until the end of your billing period.",
      });
      void utils.billing.getSubscriptionDetails.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Failed to cancel subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const reactivateMutation = api.billing.reactivateSubscription.useMutation({
    onSuccess: () => {
      toast({
        title: "Subscription reactivated",
        description: "Your subscription has been reactivated.",
      });
      void utils.billing.getSubscriptionDetails.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Failed to reactivate subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const portalMutation = api.billing.createCustomerPortalSession.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      toast({
        title: "Failed to open billing portal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubscribeSuccess = () => {
    void utils.billing.getSubscriptionDetails.invalidate();
    void utils.generation.getCreditsStatus.invalidate();
  };

  const isLoading = isLoadingSubscription || isLoadingCredits;
  const isSubscribed = creditsStatus?.plan === "SUBSCRIBED";

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and view your credits.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : isSubscribed ? (
        <>
          {/* Credits Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Credits
              </CardTitle>
              <CardDescription>
                Your monthly credits for generating images.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {creditsStatus?.credits ?? 0}
                </span>
                <span className="text-muted-foreground">/ 200</span>
              </div>
              {creditsStatus?.creditsPeriodEnd && (
                <p className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Resets on {formatDate(creditsStatus.creditsPeriodEnd)}
                </p>
              )}
              <div className="bg-muted mt-4 h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full transition-all"
                  style={{
                    width: `${Math.min(((creditsStatus?.credits ?? 0) / 200) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
              <CardDescription>
                Your current plan and billing details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border bg-green-50 p-4 dark:bg-green-950/30">
                <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900 dark:text-green-400">
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">CanvAi Pro</p>
                  <p className="text-muted-foreground text-sm">
                    $20/month · 200 credits
                  </p>
                </div>
              </div>

              {subscriptionDetails?.cancelAtPeriodEnd && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      Subscription ending
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Your subscription will end on{" "}
                      {formatDate(subscriptionDetails.creditsPeriodEnd)}. You
                      can reactivate anytime before then.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {subscriptionDetails?.cancelAtPeriodEnd ? (
                  <Button
                    onClick={() => reactivateMutation.mutate()}
                    disabled={reactivateMutation.isPending}
                  >
                    {reactivateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Reactivating...
                      </>
                    ) : (
                      "Reactivate Subscription"
                    )}
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Cancel Subscription"
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You&apos;ll retain access to your credits until the
                          end of your current billing period. After that,
                          you&apos;ll need to resubscribe to continue generating
                          images.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => cancelMutation.mutate()}
                        >
                          Cancel Subscription
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <Button
                  variant="outline"
                  onClick={() => portalMutation.mutate()}
                  disabled={portalMutation.isPending}
                >
                  {portalMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      Manage Billing
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Free Plan */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Upgrade to Pro
            </CardTitle>
            <CardDescription>
              Get 200 credits per month and skip the API setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 dark:from-violet-950/50 dark:to-fuchsia-950/50">
              <div className="mb-4">
                <span className="text-4xl font-bold">$20</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>200 image generation credits per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>No API key setup required</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Credits reset every billing cycle</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => setStripeCheckoutOpen(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Subscribe Now
            </Button>

          </CardContent>
        </Card>
      )}

      <StripeCheckout
        open={stripeCheckoutOpen}
        onOpenChange={setStripeCheckoutOpen}
        onSuccess={handleSubscribeSuccess}
      />
    </div>
  );
}



