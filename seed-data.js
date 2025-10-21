import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://formal-penguin-443.convex.cloud");

async function seedData() {
  try {
    console.log("Seeding loyalty cards...");
    await client.mutation("loyaltyCards:seedData");

    console.log("Seeding activities...");
    await client.mutation("activities:seedData");

    console.log("Seeding insights...");
    await client.mutation("insights:seedData");

    console.log("All data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();
