// import mongoose from "mongoose";
const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    
        seatNumber: {
          type: String,
        },
        isBooked: {
          type: Boolean,
          default: false,
        },
        passenger: {
          type:mongoose.Schema.Types.ObjectId,
          ref: 'customerFlightDetails',
        },
        bookedBy:{
          type:mongoose.Schema.Types.ObjectId,
          ref: 'authUser',
        },
        seatPrice:{
            type:String
        }
      
  });

module.exports={
    async up(db, client){
   
    await db.collection('flightDetails').updateMany({},{$set:{seats: [seatSchema]}});
}
,
async down(db, client){
    await db.collection('flightDetails').updateMany({},{ $unset: { seats: 1 } });

}
}
