import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    label: "Monthly",
    price: "$9/month",
    amount: 900,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    label: "Yearly",
    price: "$59/year",
    amount: 5900,
    savings: "Save 45%",
  },
} as const;
