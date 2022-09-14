//require("dotenv").config();
const jwt = require("jsonwebtoken");
const Register = require("../model/Schema.js");
const auth = async (req,res,next)=>{
    try{
       const token = req.cookies.jwt_token;
       //const verifyUser = jwt.verify(token, process.env.SECRET_KEY); // jwt.verify function return the  _id of user which is stored in database collection.
         const verifyUser = jwt.verify(token, "mynameishritikguptafullstackwebdeveloper");
       console.log(verifyUser);
       const user = await Register.findOne({_id:verifyUser});
       req.user = user;
    //    console.log(user);
      
       next();
    }
    catch(error){
        res.status(401).send("First of all you have to login then only you can chat...");
    }

}

module.exports = auth;
