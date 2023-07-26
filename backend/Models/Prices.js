import mongoose, { Schema } from "mongoose";
const pricesSchema= new Schema({
coinsRulesId:{
    type:String,
},
// foodName:{
//     type:String,
// },
// foodCategory:{
//     type:String, //N for non veg and V for veg
// },
// foodImage:{
//     type:URL,
// },
// costOfFood:{
//     type:String,
// },
airlineId:{
    type: Schema.Types.ObjectId, ref: 'airlinesDetails'
},
// costOfBaggageRules:{
//     type:Map,
//     of:String,

// },
// discounts:{
//     type:Map,
//     of:String,
// },
// CouponsValid:{
//     type:String,
// }
});
const prices=new mongoose.model("prices",pricesSchema);
// const document1=new prices({
//     foodName:"Pizza",
//     foodCategory:"V",
//     costOfFood:'180',
//     airlineId:mongoose.Types.ObjectId('643301ab1bffa1de6f4a6c1f'),
//     costOfBaggageRules:[{'5':'800'},{'10':'2000'}],
//     discounts:[{'S':'10'},{'A':'30'},{'D':'30'},{'SC':'30'},{'E':'5'}],
//     // CouponsValid:[{}],
// })
// await document1.save();
// console.log({document1},"ppp")
export default prices;
