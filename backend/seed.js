import mongoose from "mongoose";
import dotenv from "dotenv";
import Floor from "./models/Floor.js";
import Space from "./models/Space.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const seedDatabase = async () => {
  try {
    await Floor.deleteMany();
    await Space.deleteMany();

    console.log("✅ Existing data cleared!");

    // Create Floors
    const floors = await Floor.insertMany([
      { name: "Floor 1" },
      { name: "Floor 2" },
      { name: "Floor 3" },
      { name: "Floor 4" },
      { name: "Floor 5" },
      { name: "Floor 6" },
      { name: "Floor 7" },
    ]);

    console.log("✅ Floors added!");

    let spaces = [];

    // Create spaces and link them to floors
    for (const floor of floors) {
      let floorSpaces = [];
      for (let j = 1; j <= 8; j++) {
        const space = new Space({
          floorId: floor._id,
          name: `F${floor.name.split(" ")[1]}0${j}`,
          position: { x: (j % 4) * 150 + 50, y: j <= 4 ? 50 : 160, width: 120, height: 80 },
          tenantId: `T00${floor.name.split(" ")[1]}${j}`,
          tenantName: `Tenant ${floor.name.split(" ")[1]}${j}`,
          nic: `${100000000 + parseInt(floor.name.split(" ")[1]) * j}V`,
          email: `tenant${floor.name.split(" ")[1]}${j}@example.com`,
          contact: `07${floor.name.split(" ")[1]}23456${j}`,
          leaseDuration: `${parseInt(floor.name.split(" ")[1]) + j} years`,
        });

        await space.save();
        floorSpaces.push(space._id);
      }

      // Update floor with linked space IDs
      await Floor.findByIdAndUpdate(floor._id, { spaces: floorSpaces });
    }

    console.log("✅ Spaces added and linked to floors!");

    mongoose.connection.close();
    console.log("🚀 Database Seeded & Connection Closed.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
