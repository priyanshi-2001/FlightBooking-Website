import mongoose from "mongoose";

const Schema=mongoose.Schema
const loggersSchema=new Schema({
category:{
    type:String,
    enum:['baggageData','airlinesData','airportData','countryData','customerflightDetails','cpd','flightDetails','seatNumber','authUser']
},
uniqueIdentifier:{
    type:String,
},
errorValue:{
    type:String,
},
refValue1:{
    type:String
},
refValue2:{
    type:String
},
refValue3:{
    type:String
},
DateCreated : { type : Date, default: Date.now },
DateModified : { type : Date, default: Date.now }
})
const loggers= mongoose.model("loggers",loggersSchema);
// const document1=new loggers({
//     refValue2:"pppp9090",
//     refValue3:"ttt66",
//     refValue1:"222www"
// })
// document1.save();
// module.exports=loggers;
export default loggers
