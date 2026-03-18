require("dotenv").config();

const connectDB = require("../config/db");

const Food = require("../models/Food");
const EventType = require("../models/EventType");
const PartyHall = require("../models/PartyHall");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const foodData = require("./foodData");
const partyHallData = require("./partyHallData");

const bcrypt = require("bcryptjs");

const eventTypeData = [
  { name: "Wedding", basePrice: 100000 },
  { name: "Birthday", basePrice: 30000 },
  { name: "Corporate Event", basePrice: 75000 },
];

const seedData = async () => {
  try {
    await connectDB();

    // 🔥 Clear all collections
    await Food.deleteMany();
    await EventType.deleteMany();
    await PartyHall.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    console.log("🗑 Old Data Deleted");

    // 👤 Create Admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await User.create({
      name: "Admin",
      email: "admin@sattvikkaleva.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("👤 Admin Created");

    // ✅ Insert EventTypes
    const createdEventTypes = await EventType.insertMany(eventTypeData);

    // ✅ Insert PartyHalls
    await PartyHall.insertMany(partyHallData);

    // ✅ Assign first eventType to foods
    const weddingEvent = createdEventTypes[0]._id;

    const updatedFoodData = foodData.map((food) => ({
      ...food,
      eventType: weddingEvent,
    }));

    const createdFoods = await Food.insertMany(updatedFoodData);

    // 🛒 Create Dummy Order
    await Order.create({
      user: adminUser._id,
      orderItems: [
        {
          food: createdFoods[0]._id,
          quantity: 2,
        },
      ],
      totalPrice: createdFoods[0].price * 2,
      isPaid: true,
      status: "Preparing",
    });

    console.log("🛒 Dummy Order Created");

    // 🛒 Create Dummy Cart
    await Cart.create({
      user: adminUser._id,
      items: [
        {
          food: createdFoods[1]._id,
          quantity: 1,
        },
      ],
    });

    console.log("🛒 Dummy Cart Created");

    console.log("✅ Seed Data Inserted Successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seed Error:", error.message);
    process.exit(1);
  }
};

const clearData = async () => {
  try {
    await connectDB();

    await Food.deleteMany();
    await EventType.deleteMany();
    await PartyHall.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    console.log("🔥 All Data Cleared");
    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

if (process.argv.includes("--clear")) {
  clearData();
} else {
  seedData();
}