import mongoose from "mongoose";
const Schema=mongoose.Schema;
import sendEmailUtility from '../util/sendEmailUtility.js';
import customerFlightDetails from '../Models/CustomerFlightDetails.js';
import flightDetails from "./FlightDetails.js";
const flightStatusSchema=new Schema({
flightId:{
    type: Schema.Types.ObjectId, ref: 'flightDetails'
},
countryId:{
    type:String,
},
Status:{

    type:String,
    enum: ['OT', 'D', 'OWC','CWC',
'OFC','CFC','LS','WCC'
]
//'On Time', 'Delayed', 'Open For Web Check In','Closing For Web Check In',
//'Open For Flight Check In','Closing For Check In','Landed Success','Web check in closed'
},
ScheduledTakeOffTime : { type : Date},//when flight goes from fromCity
ScheduledArrivalTime : { type : Date},//when flight lands on toCity 
NewTakeOffTime : { type : Date },
NewArrivalTime : { type : Date }
})

flightStatusSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const filter = this.getFilter();
    const update = this.getUpdate();

    const originalDoc = await this.model.findOne(filter);

    if (originalDoc && update.$set.Status==='D') {
      if(update.$set.Status==='D'){
        const flightData=await flightDetails.find({_id:originalDoc.flightId}).populate('airlineId')
        const emails=await customerFlightDetails.find({flightId:originalDoc.flightId},{email:1,name:1,_id:0});
        await sendEmailUtility.sendEmail(update.$set.Status,emails,flightData,originalDoc);
      }
      console.log("Status field was modified","filter is",filter,"update is",update);
      //send email here
      next();
    }
  } catch (error) {
    console.log("Error in pre-update middleware", error);
  }
});


// flightStatusSchema.post("save", async function (doc) {
//   try {
//    console.log("in signals11",doc);
//    const originalDoc = await this.constructor.findById(doc._id);

//    // Check if the original document exists and if the Status field is modified
//    if (originalDoc && originalDoc.Status !== doc.Status) {
//           //send email here
//      console.log("Status field has been modified");
//    }
    
//   } catch (error) {
//     console.log("in signals error",String(error))
//   }
// });

const flightStatus=new mongoose.model("flightStatus",flightStatusSchema);
export default flightStatus;

