const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database connection failed:", error.message);
  }
};

module.exports = mongoDB;
