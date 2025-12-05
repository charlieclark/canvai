import { trackSignup } from "@/lib/utils/tracking";
import { useClerk } from "@clerk/nextjs";
import { track } from "@vercel/analytics/react";
import { useRouter } from "next/navigation";

const USE_WAITLIST = false; //process.env.NODE_ENV === "production";

export default function useSignupModal() {
  const { openSignUp, openWaitlist, joinWaitlist, user } = useClerk();

  const router = useRouter();

  const openSignupModal = ({
    redirectUrl = "/onboarding",
    email,
  }: {
    redirectUrl?: string;
    email?: string;
  } = {}) => {
    if (user) {
      router.push(redirectUrl);
      return;
    }

    // vercel analytics
    track("signup");

    // google analytics
    trackSignup();

    // clerk
    if (USE_WAITLIST) {
      if (email) {
        void joinWaitlist({
          emailAddress: email,
        });
      } else {
        openWaitlist();
      }
    } else {
      openSignUp({
        forceRedirectUrl: redirectUrl,
        initialValues: { emailAddress: email },
      });
    }
  };

  return { openSignupModal };
}
