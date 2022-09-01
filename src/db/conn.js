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
  .connect( "mongodb+srv://HriTech:Mongodb123@cluster0.pluvvyc.mongodb.net/iChat")
  .then(() => {
    console.log("Successfully connected");
  })
  .catch((e) => {
    console.log(e);
  });
