"use client";

import { Button } from "@/components/ui/button";
import useSignupModal from "@/hooks/use-signup";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { WaveTransition, creamToDarkWaveCompact } from "./wave-transition";

export function CTASection() {
  const { openSignupModal } = useSignupModal();

  return (
    <section className="relative overflow-hidden bg-[#F5F3EE] pt-16 pb-48">
      {/* Subtle decorative elements */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#0066CC]/5 to-[#059669]/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#F97316]/5 to-[#FBBF24]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-screen-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-5xl">
            Ready to bring your ideas to life?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
            Start creating stunning AI art with CanvAi Pro. Transform your
            sketches into polished artwork in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => openSignupModal()}
              className="group h-14 rounded-full bg-slate-900 px-8 text-base font-medium text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom waves transition to dark footer */}
      <WaveTransition {...creamToDarkWaveCompact} />
    </section>
  );
}
