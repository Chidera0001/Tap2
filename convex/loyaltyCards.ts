import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all loyalty cards
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("loyaltyCards").collect();
  },
});

// Query to get a single loyalty card by ID
export const get = query({
  args: { id: v.id("loyaltyCards") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Mutation to create a new loyalty card
export const create = mutation({
  args: {
    businessName: v.string(),
    location: v.string(),
    activeCards: v.number(),
    redemptions: v.number(),
    rewardThreshold: v.number(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("loyaltyCards", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Mutation to update loyalty card stats
export const updateStats = mutation({
  args: {
    id: v.id("loyaltyCards"),
    activeCards: v.number(),
    redemptions: v.number(),
  },
  handler: async (ctx, { id, activeCards, redemptions }) => {
    return await ctx.db.patch(id, { activeCards, redemptions });
  },
});

// Seed data mutation for demo purposes
export const seedData = mutation({
  handler: async (ctx) => {
    const existingCards = await ctx.db.query("loyaltyCards").collect();
    
    if (existingCards.length > 0) {
      return { message: "Database already has data" };
    }
    
    const seedCards = [
      {
        businessName: 'Café Amsterdam',
        location: 'Amsterdam, Netherlands',
        activeCards: 234,
        redemptions: 89,
        rewardThreshold: 10,
        color: '#0055FF',
        createdAt: Date.now() - 86400000 * 30
      },
      {
        businessName: 'Bistro Rotterdam',
        location: 'Rotterdam, Netherlands',
        activeCards: 156,
        redemptions: 67,
        rewardThreshold: 8,
        color: '#FF6B35',
        createdAt: Date.now() - 86400000 * 15
      },
      {
        businessName: 'The Hague Coffee',
        location: 'The Hague, Netherlands',
        activeCards: 89,
        redemptions: 23,
        rewardThreshold: 12,
        color: '#28A745',
        createdAt: Date.now() - 86400000 * 7
      }
    ];
    
    for (const card of seedCards) {
      await ctx.db.insert("loyaltyCards", card);
    }
    
    return { message: "Seed data added successfully" };
  },
});
