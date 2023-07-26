import mongoose from "mongoose";

const Schema=mongoose.Schema
const seatClassSchema=new Schema({
flightId:{
    type: {type: Schema.Types.ObjectId, ref: 'flightDetails'}
},
airlineId:{
    type: {type: Schema.Types.ObjectId, ref: 'airlinesDetails'}
},
seatNo:{
    type:String,//for every flightId it will be diff run a cron job to delete the seats data after one hour of flight landing
}

})

const seatClass=new mongoose.model("seatClass",seatClassSchema);
// const document1=new seatClass({
//     seatNo:200
// })
// document1.save();
export default seatClass;
