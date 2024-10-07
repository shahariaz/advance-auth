import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const instance = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB Connected: ${instance.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
