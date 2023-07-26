import mongoose from "mongoose";
const Schema=mongoose.Schema
const bookingSchema=new Schema({
userId://this will refer to user who booked it
{type: Schema.Types.ObjectId, ref: 'authUser'},//not necessary that passenger whose booking we are doing has signuped and we had record in user table for it.
cfdId:
    [{type:Schema.Types.ObjectId, ref:'customerFlightDetails'}]
,
ref1:{
    type:String
},
ref2:{
    type:String
},
ref3:{
    type:String
},
dateCreated:{
    type:Date
}
})
const bookingDetails=new mongoose.model("booking",bookingSchema);
export default bookingDetails
