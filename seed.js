import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedUser = async () => {
  try {
    await User.deleteMany({});
    const user = new User({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });
    await user.save();
    console.log("User seeded:", user);
    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding error:", err);
    mongoose.connection.close();
  }
};

seedUser();
