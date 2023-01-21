const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(`${process.env.DB_URL}`);

const db = mongoose.connection;

db.on("error", () => {
  console.log("ther is an error while connecting to the database");
});

db.once("open", () => {
  console.log("successfully connected to the database");
});
