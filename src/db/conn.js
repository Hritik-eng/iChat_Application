//require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://HriTech:Mongodb123@cluster0.pluvvyc.mongodb.net/iChat")
  .then(() => {
    console.log("Successfully connected");
  })
  .catch((e) => {
    console.log(e);
  });
