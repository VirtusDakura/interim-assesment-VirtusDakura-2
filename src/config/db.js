import mongoose from "mongoose";

export async function connectDB() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set. Add it to your .env file.");
  }

  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
}
