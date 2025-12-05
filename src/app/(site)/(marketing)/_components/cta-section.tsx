import { Button } from "@/components/ui/button";
import { track } from "@vercel/analytics/react";
import useSignupModal from "@/hooks/use-signup";

export function CTASection() {
  const { openSignupModal } = useSignupModal();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 pb-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C5C91] to-gray-800">
        {/* CTA Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative px-6 py-16 sm:p-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to create your storybook?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-100">
              Create a story in minutes. No credit card required.
            </p>
            <Button
              size="lg"
              className="mt-8 rounded-full bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => {
                openSignupModal();
                track("cta_bottom");
              }}
            >
              Create Your Storybook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
