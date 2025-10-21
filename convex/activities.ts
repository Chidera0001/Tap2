import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get recent activities, optionally filtered by business
export const list = query({
  args: { businessName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let activities;

    if (args.businessName) {
      activities = await ctx.db
        .query("activities")
        .filter((q) => q.eq(q.field("businessName"), args.businessName))
        .order("desc")
        .take(50); // Increased to get more activities for 24-hour filtering
    } else {
      activities = await ctx.db.query("activities").order("desc").take(50); // Increased to get more activities for 24-hour filtering
    }

    return activities;
  },
});

// Create a new activity
export const create = mutation({
  args: {
    businessName: v.string(),
    type: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("activities", {
      businessName: args.businessName,
      type: args.type,
      message: args.message,
      timestamp: Date.now(),
    });

    return activityId;
  },
});

// Seed activities data
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    const businesses = await ctx.db.query("loyaltyCards").collect();

    const activities: any[] = [];

    businesses.forEach((business) => {
      // Generate more realistic activities for each business within the past 24 hours
      const now = Date.now();
      const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

      // Generate 8-12 activities per business within the past 24 hours
      const activityCount = Math.floor(Math.random() * 5) + 8; // 8-12 activities

      for (let i = 0; i < activityCount; i++) {
        const activityTypes = ["card", "redemption", "update", "stats"];
        const randomType =
          activityTypes[Math.floor(Math.random() * activityTypes.length)];

        let message = "";
        switch (randomType) {
          case "card":
            message = `New loyalty card created for ${business.businessName}`;
            break;
          case "redemption":
            message = `Customer redeemed reward at ${business.businessName}`;
            break;
          case "update":
            message = `Loyalty program updated for ${business.businessName}`;
            break;
          case "stats":
            message = `${business.activeCards} active cards at ${business.businessName}`;
            break;
        }

        // Generate timestamp within the past 24 hours
        const randomTime =
          twentyFourHoursAgo + Math.random() * (24 * 60 * 60 * 1000);

        activities.push({
          businessName: business.businessName,
          type: randomType,
          message: message,
          timestamp: Math.floor(randomTime),
        });
      }
    });

    // Insert all activities
    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }

    return activities.length;
  },
});
