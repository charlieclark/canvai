import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { getBaseProductionUrl } from "./lib/utils/urls";
import { type NextFetchEvent, type NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
]);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: `${getBaseProductionUrl()}/?signUp=true&pathname=${req.nextUrl.pathname}`,
    });
  }
});

export default async function proxy(
  req: NextRequest,
  event: NextFetchEvent,
) {
  // Run Clerk middleware
  return clerkHandler(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
