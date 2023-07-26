
import mongoose from "mongoose";
const Schema=mongoose.Schema
const flightDetailsSchema=new Schema({
    //its auto geneated id is flightid of other tables
fromCountryId: {
    type: String,
  },
  toCountryId:{
    type:String,
  },
  airlineId:{
    type: Schema.Types.ObjectId, ref: 'airlinesDetails'
  },
  airportId:{
    type: Schema.Types.ObjectId, ref: 'airportData'
  },
fromCity:{
    type:String,//these are foreign keys to airporttable
},
toCity:{
    type:String,//these are foreign keys to airporttable
},
isInActive:{
    type:Boolean,
    default:false,
},
departureTime:{
    type:Date,
},
arrivalTime:{
    type:Date,
}, 
// journeyTime:{
//     type:Date,
// },
fare:{//make a new table to store fare rules,baggage extra cost rules,student discount,armed forced discount,cancellation policy,date change policy 
    type:String
},

seats: [
  {
    seatNumber: {
      type: String,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    passenger: {
      type:Schema.Types.ObjectId,
      ref: 'customerFlightDetails',
    },
    bookedBy:{
      type:Schema.Types.ObjectId,
      ref: 'authUser',
    },
    seatPrice:{
      type:String
    }
  },
]

})

const flightDetails= mongoose.model("flightDetails",flightDetailsSchema);
export default flightDetails;
