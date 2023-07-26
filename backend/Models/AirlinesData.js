import mongoose from "mongoose";
const Schema=mongoose.Schema
const airlinesDetailsSchema=new Schema({
// _id: mongoose.Schema.Types.ObjectId,
numOfSeats:{
    type:Number,
},
modelNumber:{
    type:String,
},
name:{
type:String,
},
food:{
    type:String,
},
coinsRulesId:{
    type:String,
},
costOfBaggage:{
    type:String,
},
discounts:{
    type:String,
}

})
const airlinesDetails= mongoose.model("airlinesDetails",airlinesDetailsSchema);
export default airlinesDetails
// const document1=new airlinesDetails({
//     numOfSeats:200,
//     models:'H56TYYEDFWE',
//     name:"Vistara",
// },
// {
//     numOfSeats:853,
//     models:'H56TYYEDFWE',
//     name:"Emirates",
// },
// {
//     numOfSeats:126,
//     models:'H56TYYEDFWE',
//     name:"Spicejet",
// },
// {
//     numOfSeats:180,
//     models:'H56TYYEDFWE',
//     name:"Indigo",
// },
// {
//     numOfSeats:180,
//     models:'H56TYYEDFWE',
//     name:"Air Asia",
// },
// {
//     numOfSeats:256,
//     models:'H56TYYEDFWE',
//     name:"Air India",
// }

// )
// document1.save();
// module.exports=airlinesDetails;
