const mongoose = require("mongoose")
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
    }
})


// make the collection(table) table name should be singular and the first letter should be capital

const  Register = new mongoose.model("Register",employeeSchema)
module.exports = Register;