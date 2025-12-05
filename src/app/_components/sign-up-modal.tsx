"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import useSignupModal from "@/hooks/use-signup";

export function SignUpModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useClerk();
  const { openSignupModal } = useSignupModal();

  useEffect(() => {
    if (searchParams?.get("signUp") === "true" && !user) {
      const pathname = searchParams?.get("pathname") ?? "/";

      // Open the sign-up modal
      openSignupModal({
        redirectUrl: pathname,
      });

      // Create new URLSearchParams without the signUp parameter
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("signUp");
      newSearchParams.delete("pathname");

      // Replace the URL without the signUp parameter
      const newPathname = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;

      router.replace(newPathname);
    }
  }, [searchParams, openSignupModal, router, user]);

  return null;
}
