require("dotenv").config();
const mongoose = require("mongoose");
// mongoose
//   .connect("mongodb://127.0.0.1:27017/iChat")
//   .then(() => {
//     console.log("Successfully connected");
//   })
//   .catch((e) => {
//     console.log(e);
//   });


mongoose
  .connect(process.env.MongoDB_URL)
  .then(() => {
    console.log("Successfully connected");
  })
  .catch((e) => {
    console.log(e);
  });
