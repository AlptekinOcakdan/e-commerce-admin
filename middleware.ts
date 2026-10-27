import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isClerkEnabled } from "@/lib/auth";

// authMiddleware was removed in Clerk v6; this keeps its behaviour: everything protected except the public API and auth pages.
const isPublicRoute = createRouteMatcher(["/api/(.*)", "/sign-in(.*)", "/sign-up(.*)"]);

export default isClerkEnabled
  ? clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) await auth.protect();
    })
  : () => NextResponse.next();

export const config = {
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
