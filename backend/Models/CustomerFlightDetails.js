import mongoose from "mongoose";
import express from "express";
const app = express();
import  {Server}  from "socket.io";
import http from 'http';
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: ["http://localhost:3000","http://localhost:3001"]
  },
});

const Schema=mongoose.Schema
const customerFlightDetailsSchema=new Schema({
flightId:
 {type: Schema.Types.ObjectId, ref: 'flightDetails'},
userId://this will refer to user who booked it
{type: Schema.Types.ObjectId, ref: 'authUser'},
name:{
    type:String
},
email:{
    type:String
},
phNum:{
    type:String
},
age:{
    type:String
},
address:{
    type:String
},
gender:{
    type:String
},
//not necessary that passenger whose booking we are doing has signuped and we had record in user table for it.
bookedOn:{
    type:Date,
},
checkInTime:{
    type:Date,
},
foodBooked:{
type:String,
},
extraBaggageBooked:{
type:String,//yes or no
},
checkedInBaggageId:{
    type:Schema.Types.ObjectId,ref:'baggageDetails'
},
webCheckedIn:{
    type:Boolean,
},
seatNumber:{
type:String
},
seatPrice:{
    type:String,
},
seatClass:{
    type:'String',
    enum:['B','E','EP'] //B:business, E:Economy,'EP:Economy Premium
},
paymentDone:{
type:Boolean,
},
paymentId:{
    type:Schema.Types.ObjectId, ref:'paymentInfo'
},
paymentResponse:{
    type:String,
},
categoryOfBooking:{
    type:'String',
    enum:['S','A','SC','R','D','E'] //Student,Armed Forces, Senior Citizen, Regular,Doctors , Extra seat
},
bookedBy:{
    type:String //this will point to userId of user table to know which user logged in and booked the flight 
},
cpdId:{
    type:String,//points to cpd id 
},
foodPrice:{
    type:String,
},
flightLanded:{
    type:Boolean,
    default:false
}
})

const customerFlightDetails=new mongoose.model("customerFlightDetails",customerFlightDetailsSchema);
export default customerFlightDetails
