import mongoose from "mongoose";

export const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;

  const DB_HOST = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=goit-hw`;

  try {
    await mongoose.connect(DB_HOST);
    console.log("✅ Mongo connection successfully established!");
  } catch (error) {
    console.error("❌ Mongo connection failed:", error);
    process.exit(1);
  }
};
