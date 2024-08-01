import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONG0_URI);
    console.log(`[INFO]: MongoDB Connect ${conn.connection.host}`);
  } catch (error) {
    console.log(`[ERROR]: ${error.message}`);
    process.exit();
  }
};

export default connectDB;
