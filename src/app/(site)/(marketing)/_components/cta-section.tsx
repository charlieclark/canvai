"use client";

import { Button } from "@/components/ui/button";
import useSignupModal from "@/hooks/use-signup";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  const { openSignupModal } = useSignupModal();

  return (
    <section className="relative overflow-hidden bg-[#0f172b] py-24">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-screen-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to bring your ideas to life?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
            Bring your own Replicate API key and start creating. You only pay
            for what you generate—no subscriptions, no hidden fees.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => openSignupModal()}
              className="group h-14 rounded-full bg-white px-8 text-base font-medium text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
{/* 
          <p className="mt-6 text-sm text-slate-500">
            Join 500+ creators already using Nano Canvas
          </p> */}
        </motion.div>
      </div>
    </section>
  );
}

