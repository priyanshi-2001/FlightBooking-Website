
import mongoose from "mongoose";

const Schema=mongoose.Schema
const userSchema=new Schema({
CountryName:{
    type:String,
},
CountryCode: {
    type: String,
    length:3,
  },
  
})
const country= mongoose.model("country",userSchema);
// const document1=new country({
//    CountryName:'Afghanistan',
//    CountryCode:'AF'
// }
// )
// document1.save();
// module.exports=country;
export default country