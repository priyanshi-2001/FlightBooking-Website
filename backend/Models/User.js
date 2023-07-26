import mongoose from "mongoose";

const Schema=mongoose.Schema
const userSchema=new Schema({
Name:{
    type:String,
    required:true,
},
email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  phNum:{
    type:Number,
  },
  gender:{
    type:String,
  },
})
const user= mongoose.model("authUser",userSchema);
export default user;
// const document1=new user({
//     Name:"demo",
//     email:"demo23@gmail.com",
//     password:'viotto'
// })
// document1.save();
