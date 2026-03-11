import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  pro: {
    name: "Pro",
    description: "For individual power users",
    price: 12,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      "Unlimited AI messages",
      "All messaging channels",
      "Priority support",
      "Custom assistant identity",
      "Voice & TTS",
    ],
  },
  team: {
    name: "Team",
    description: "For teams and businesses",
    price: 39,
    priceId: process.env.STRIPE_TEAM_PRICE_ID!,
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared memory & context",
      "Admin dashboard",
      "SLA support",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
