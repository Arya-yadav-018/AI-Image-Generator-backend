import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

name:{
    type : String,
    required : true
},

email : {
    type : String,
    require : true,
    unique : true
},

password : {
    type : String,
    required : true
},

creditBalance : {
    type : Number,
    default : 5
}

}, {timestamps:true})

export const User = mongoose.model("User" , userSchema);