
import mongoose from "mongoose";

const Schema=mongoose.Schema
const baggageSchema=new Schema({
flightId:{
    type: {type: Schema.Types.ObjectId, ref: 'flightDetails'}
},
userId: {
    type: String,
},
baggageCheckInTime:{
    type:Date,
},
baggageId:{
    type:String,
},
weight:{
    type:String,
},
extraPriceForBaggage:{//if he paid extra money its val will have baggage table id
    type:String,
    default:'',
},
cpdId:{
    type:String 
},
reference1:{
    type:String//stores cfdId
},
reference2:{
    type:String
}
  
})
const baggageDetails=new mongoose.model("baggageDetails",baggageSchema);
// const document1=new baggageDetails({
//     flightId:'76',
//     userId:'900',
//     weight:'15',
//     extraPriceForBaggage:'600'
// }
// )
// document1.save();
// module.exports=baggageDetails;
export default baggageDetails