const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

const db = mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database...");
  })
  .catch((error) => {
    console.log("Database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  });

module.exports = db;
