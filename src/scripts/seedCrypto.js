import "dotenv/config";
import { connectDB } from "../config/db.js";
import Crypto from "../models/Crypto.js";
import { seedCryptos } from "../data/seedCryptos.js";

async function seedCrypto() {
  try {
    await connectDB();

    await Crypto.deleteMany({});
    await Crypto.insertMany(seedCryptos);

    console.log(`Seeded ${seedCryptos.length} crypto records.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed crypto data:", error.message);
    process.exit(1);
  }
}

seedCrypto();
