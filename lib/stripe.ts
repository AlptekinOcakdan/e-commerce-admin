import Stripe from "stripe";

let client: Stripe | undefined;

// Created on first use: current Stripe SDKs throw on a missing key, which broke `next build` without STRIPE_API_KEY.
export const getStripe = () => client ??= new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2026-09-30.endive",
  typescript: true,
});
