import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get insights, optionally filtered by business
export const list = query({
  args: { businessName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let insights;

    if (args.businessName) {
      insights = await ctx.db
        .query("insights")
        .filter((q) => q.eq(q.field("businessName"), args.businessName))
        .order("desc")
        .take(5);
    } else {
      // Get global insights (no businessName) and business-specific insights
      const globalInsights = await ctx.db
        .query("insights")
        .filter((q) => q.eq(q.field("businessName"), undefined))
        .order("desc")
        .take(3);

      const businessInsights = await ctx.db
        .query("insights")
        .filter((q) => q.neq(q.field("businessName"), undefined))
        .order("desc")
        .take(2);

      insights = [...globalInsights, ...businessInsights];
    }

    return insights;
  },
});

// Create a new insight
export const create = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.string(),
    businessName: v.optional(v.string()),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const insightId = await ctx.db.insert("insights", {
      type: args.type,
      title: args.title,
      description: args.description,
      businessName: args.businessName,
      priority: args.priority,
      createdAt: Date.now(),
    });

    return insightId;
  },
});

// Seed insights data
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    const businesses = await ctx.db.query("loyaltyCards").collect();

    if (businesses.length === 0) return 0;

    // Calculate top and lowest performing businesses
    const businessesWithEngagement = businesses.map((business) => ({
      ...business,
      engagement: (business.redemptions / business.activeCards) * 100,
    }));

    const topPerforming = businessesWithEngagement.reduce((top, current) =>
      current.engagement > top.engagement ? current : top
    );

    const lowestPerforming = businessesWithEngagement.reduce((low, current) =>
      current.engagement < low.engagement ? current : low
    );

    const insights = [
      // Global insights
      {
        type: "trend",
        title: "Peak Redemption Days",
        description:
          "Wednesdays and Fridays are peak redemption days. Schedule targeted notifications for these days.",
        businessName: undefined,
        priority: "medium",
        createdAt: Date.now(),
      },
      {
        type: "recommendation",
        title: "Engagement Optimization",
        description:
          "Consider implementing push notifications to increase customer engagement across all programs.",
        businessName: undefined,
        priority: "high",
        createdAt: Date.now() - 3600000,
      },
      // Business-specific insights
      {
        type: "performance",
        title: "Top Performer",
        description: `${topPerforming.businessName} shows the highest engagement rate this month. Consider promoting their program further.`,
        businessName: topPerforming.businessName,
        priority: "high",
        createdAt: Date.now() - 7200000,
      },
      {
        type: "performance",
        title: "Improvement Opportunity",
        description: `${lowestPerforming.businessName} has the lowest active cards. Review their reward threshold or promotional strategy.`,
        businessName: lowestPerforming.businessName,
        priority: "medium",
        createdAt: Date.now() - 10800000,
      },
    ];

    // Insert all insights
    for (const insight of insights) {
      await ctx.db.insert("insights", insight);
    }

    return insights.length;
  },
});
