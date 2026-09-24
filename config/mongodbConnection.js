const mongoose = require("mongoose");

const mongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Database Connected");
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mongoDB;
