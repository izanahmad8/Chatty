import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to Database:", error);
  }
};

export default connectToDb;
