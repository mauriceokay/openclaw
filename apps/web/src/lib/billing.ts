import { stripe } from "./stripe";
import { prisma } from "./prisma";
import type { ModelDef } from "./models";

// Non-Claude usage is billed at 3× the provider's token cost
const MARKUP = 3;

/**
 * Record token usage for a completed request and, for non-Claude models
 * using the platform key, report metered usage to Stripe.
 *
 * Set STRIPE_USAGE_PRICE_ID in your env to a Stripe metered price where
 * 1 unit = $0.000001 (one micro-dollar).
 */
export async function recordUsage({
  userId,
  channel,
  model,
  inputTokens,
  outputTokens,
  ownKey,
}: {
  userId: string;
  channel: string;
  model: ModelDef;
  inputTokens: number;
  outputTokens: number;
  /** true when the user supplied their own API key — no Stripe billing */
  ownKey: boolean;
}) {
  const costUsd =
    (inputTokens / 1_000_000) * model.inputPricePerM +
    (outputTokens / 1_000_000) * model.outputPricePerM;

  // Claude models are included in the subscription; no extra charge
  const isIncluded = model.provider === "anthropic";
  const billedUsd = isIncluded || ownKey ? 0 : costUsd * MARKUP;

  let reportedStripe = false;

  // Only charge when: non-Claude + using platform key + Stripe price configured
  if (!isIncluded && !ownKey && billedUsd > 0) {
    const usagePriceId = process.env.STRIPE_USAGE_PRICE_ID;
    if (usagePriceId) {
      try {
        const sub = await prisma.subscription.findUnique({
          where: { userId },
          select: { stripeSubscriptionId: true },
        });

        if (sub?.stripeSubscriptionId) {
          const stripeSub = await stripe.subscriptions.retrieve(
            sub.stripeSubscriptionId,
          );
          const item = stripeSub.items.data.find(
            (i) => i.price.id === usagePriceId,
          );

          if (item) {
            // 1 unit = $0.000001; round up so we never undercharge
            const units = Math.ceil(billedUsd * 1_000_000);
            await stripe.subscriptionItems.createUsageRecord(item.id, {
              quantity: units,
              timestamp: Math.floor(Date.now() / 1000),
              action: "increment",
            });
            reportedStripe = true;
          }
        }
      } catch (err) {
        // Non-fatal: log and continue — the UsageRecord row will have
        // reportedStripe=false so it can be reconciled later
        console.error("[billing] Stripe usage report failed:", err);
      }
    }
  }

  await prisma.usageRecord.create({
    data: {
      userId,
      channel,
      model: model.id,
      provider: model.provider,
      inputTokens,
      outputTokens,
      costUsd,
      billedUsd,
      reportedStripe,
    },
  });
}
