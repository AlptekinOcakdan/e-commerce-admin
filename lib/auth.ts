import { auth as clerkAuth } from "@clerk/nextjs/server";

// Without Clerk keys the app runs in local "dev auth" mode: every request is this fixed user.
export const isClerkEnabled = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
export const DEV_USER_ID = "user_dev_local";

export const auth = async () => isClerkEnabled ? clerkAuth() : { userId: DEV_USER_ID };
