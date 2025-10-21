import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  loyaltyCards: defineTable({
    businessName: v.string(),
    location: v.string(),
    activeCards: v.number(),
    redemptions: v.number(),
    rewardThreshold: v.number(),
    color: v.string(),
    createdAt: v.number(),
  }),
});
