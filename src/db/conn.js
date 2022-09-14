//require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(MONGODB_ATALAS_URL)
  .then(() => {
    console.log("Successfully connected");
  })
  .catch((e) => {
    console.log(e);
  });
