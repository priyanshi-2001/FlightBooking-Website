
import mongoose from "mongoose";

const Schema=mongoose.Schema
const paymentInfoSchema=new Schema({
cfdId:{
    type:String//id of cfd table auto gen id
},
paymentDate:{
    type:Date
},
amount:{
    type:String
},
orderCreationResponse:{
    type:String,
},
ref1:{
    type:String,
},
ref2:{
    type:String,
},
ref3:{
    type:String,
},
ref4:{
    type:String,
},
ref5:{
    type:String,
}

})
const paymentInfoDetails=new mongoose.model("paymentInfo",paymentInfoSchema);
// const document1=new customerFlightDetails({
//     foodBooked:"899",
//     seatNumber:"9",
//     categoryOfBooking:"R",
//     flightId:mongoose.Types.ObjectId('643312121bffa1de6f4a6c34')
// })
// document1.save();
// module.exports=customerFlightDetails;

export default paymentInfoDetails
