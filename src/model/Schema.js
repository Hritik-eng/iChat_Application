//require("dotenv").config();
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
      token:{
        type:String,
        required:true
      }
    }]
})


// Generating the authentication token
employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, "mynameishritikguptafullstackwebdeveloper");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(error){
        res.send("the error part" + error);
        
    }
}


// Converting password into hash value
employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
    this.password =await bcrypt.hash(this.password, 10);  // 10 is the round means 10 round steps take to genrate the hash password
    this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})



// make the collection(table) table name should be singular and the first letter should be capital

const  Register = new mongoose.model("Register",employeeSchema)
module.exports = Register;
