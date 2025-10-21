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
  activities: defineTable({
    businessName: v.string(),
    type: v.string(), // 'card', 'redemption', 'update', 'stats'
    message: v.string(),
    timestamp: v.number(),
  }),
  insights: defineTable({
    type: v.string(), // 'performance', 'trend', 'recommendation'
    title: v.string(),
    description: v.string(),
    businessName: v.optional(v.string()), // null for global insights
    priority: v.string(), // 'high', 'medium', 'low'
    createdAt: v.number(),
  }),
});
