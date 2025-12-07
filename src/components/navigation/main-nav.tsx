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
    <div className="fixed top-0 right-0 left-0 z-50 px-4 py-4">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-slate-200/60 bg-white/90 px-4 shadow-[0_2px_20px_-2px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            {/* Logo mark */}
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#0066CC] to-[#059669]" />
              <div className="absolute inset-[3px] rounded-md bg-white" />
              <div className="absolute inset-[6px] rounded bg-gradient-to-br from-[#0066CC] to-[#059669]" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-[#0066CC] to-[#059669] bg-clip-text text-transparent">
                CanvAi
              </span>
            </span>
          </Link>
          {/* <div className="hidden items-center gap-6 md:flex">
            {mainNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  document
                    .getElementById(link.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                {link.label}
              </button>
            ))}
          </div> */}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Button
              variant="ghost"
              className="hidden rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
              onClick={() =>
                openSignIn({
                  forceRedirectUrl: route_dashboard()(),
                })
              }
            >
              Sign In
            </Button>
            <Button
              className="rounded-full bg-slate-900 text-white shadow-sm hover:bg-slate-800"
              onClick={() => {
                openSignupModal();
              }}
            >
              Get Started
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              suppressHydrationWarning
              className="rounded-full bg-slate-900 text-white shadow-sm hover:bg-slate-800"
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
