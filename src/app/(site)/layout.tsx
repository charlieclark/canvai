import "@/styles/globals.css";

import { Geist } from "next/font/google";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getBaseProductionUrl } from "@/lib/utils/urls";
import Script from "next/script";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseProductionUrl()),
  title: "CanvAi",
  description: "Showcase the things that make you, you.",
  icons: [{ rel: "icon", url: "/favicon.png" }],
  openGraph: {
    type: "website",
    images: [
      {
        url: "/meta.png",
      },
    ],
  },
};

const ENABLE_ANALYTICS = false;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <head>
        {ENABLE_ANALYTICS && (
          <>
            <Script
              async
              src="https://www.googletagmanager.com/gtag/js?id=AW-17050543013"
            />
            <Script id="google-analytics">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17050543013');
          `}
            </Script>
          </>
        )}
      </head>
      <body>
        <ClerkProvider>
          <Analytics />
          <TRPCReactProvider>
            <TooltipProvider>
              <Toaster />
              {children}
            </TooltipProvider>
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
