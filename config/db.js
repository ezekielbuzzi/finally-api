const mongoose = require("mongoose");
const keys = require("./keys");

const connectDB = async () => {
  try {
    await mongoose.connect(keys.MONGO_URI);
    console.log("Database successfully connected");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
