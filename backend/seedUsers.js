// backend/seedUsers.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@neoconnect.com",
    password: "Admin@123",
    role: "admin",
    department: "Administration",
  },
  {
    name: "Staff User",
    email: "staff@neoconnect.com",
    password: "Staff@123",
    role: "staff",
    department: "General",
  },
  {
    name: "Secretariat User",
    email: "secretariat@neoconnect.com",
    password: "Secretariat@123",
    role: "secretariat",
    department: "Secretariat",
  },
  {
    name: "Case Manager User",
    email: "casemanager@neoconnect.com",
    password: "CaseManager@123",
    role: "case_manager",
    department: "Case Handling",
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await User.deleteMany({
      email: { $in: users.map((u) => u.email) },
    });

    await User.create(users);

    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedUsers();