"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import useSignupModal from "@/hooks/use-signup";

export function HeroSection() {
  const { openSignupModal } = useSignupModal();

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 pt-10 text-center lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-6 flex w-24 justify-center">
            <Image
              src="/homepage/logo-book.svg"
              alt="Logo"
              width={50}
              height={50}
              priority
              className="h-auto w-auto"
            />
          </div>
          <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text py-[10px] text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
            CanvAI
          </h1>
          <p className="text-md mt-6 leading-8 text-slate-600 md:text-lg">
            Showcase the things that make you, you.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              size="lg"
              onClick={() => {
                openSignupModal();
              }}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                console.log("learn more");
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-24">hero</div>
    </>
  );
}
