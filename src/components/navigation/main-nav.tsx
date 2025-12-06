"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import useSignupModal from "@/hooks/use-signup";
import { route_dashboard } from "@/routes";
import { mainNavLinks } from "@/config/navigation";

export function MainNav() {
  const { openSignIn } = useClerk();
  const { openSignupModal } = useSignupModal();
  return (
    <div className="sticky left-0 right-0 top-0 z-50 px-4 py-4">
      <nav className="mx-auto flex h-14 max-w-screen-xl items-center justify-between rounded-full border bg-white/80 px-4 shadow-[0_2px_20px_-2px_rgba(0,0,0,0.05)] backdrop-blur-md transition-all hover:bg-white/90 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-[#66A8D4] to-[#0C5C91] bg-clip-text text-transparent">
                CanvAI
              </span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {mainNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  document
                    .getElementById(link.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <Button
              variant="ghost"
              className="hidden rounded-full md:inline-flex"
              onClick={() =>
                openSignIn({
                  forceRedirectUrl: route_dashboard()(),
                })
              }
            >
              Sign In
            </Button>
            <Button
              variant="default"
              className="rounded-full"
              onClick={() => {
                openSignupModal();
              }}
            >
              Get Started Free
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              suppressHydrationWarning
              variant="default"
              className="rounded-full"
              asChild
            >
              <Link href={route_dashboard()()}>Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}
