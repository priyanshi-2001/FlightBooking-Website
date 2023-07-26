
import mongoose from "mongoose";

const Schema=mongoose.Schema
const airportSchema=new Schema({
code:{
    type:String,
},
name:{
    type:String,
},
city:{
    type:String,
},
state:{
    type:String,
},
countryId:{
    type:Schema.Types.ObjectId, ref: 'country'
},
})
const airportData= mongoose.model("airportData",airportSchema);
export default airportData
// const document1=new airportData(
//     [
//         {
//             code: "ADL",
//             name: "Adelaide International Airport",
//             city: "Adelaide",
//             state: "South Australia",
//             country: "6429e1e9bcaa5e4087638e6b"
//         },
//         {
//             code: "ALH",
//             name: "Albany Airport",
//             city: "Albany",
//             state: "Western Australia",
//             country: "6429e1e9bcaa5e4087638e6b"
//         },
//         {
//              code: "ARM",
//             name: "Armidale Airport",
//             city: "Armidale",
//             state: "New South Wales",
//             country: "6429e1e9bcaa5e4087638e6b"
//         },
//         {
//             code: "ASP",
//             name: "Alice Springs Airport",
//             city: "Alice Springs",
//             state: "Northern Territory",
//             country: "6429e1e9bcaa5e4087638e6b"
//         },
//         {
//             code: "AGR",
//             name: "Agra Airport",
//             city: "Agra",
//             state: "Uttar Pradesh",
//             country:"6429e1e9bcaa5e4087638e6c",
//         },
//         {
//             code: "AGX",
//             name: "Agatti Island Airport",
//             city: "Agatti Island",
//             state: "Lakshadweep",
//             country:"6429e1e9bcaa5e4087638e6c",
//         },
//         {
//             code: "AGR",
//             name: "Agra Airport",
//             city: "Agra",
//             state: "Uttar Pradesh",
//             country:"6429e1e9bcaa5e4087638e6c",
//         },
//         {
//             code: "AJL",
//             name: "Aizwal Airport",
//             city: "Aizawl",
//             state: "Mizoram",
//             country:"6429e1e9bcaa5e4087638e6c",
//         },
//         {
//             code: "AMD",
//             name: "Sardar Vallabhbhai Patel International Airport",
//             city: "Ahmedabad",
//             state: "Gujarat",
//             country:"6429e1e9bcaa5e4087638e6c",
//         },
//         {
//             code: "ATQ",
//             name: "Raja Sansi Airport",
//             city: "Raja Sansi",
//             state: "Punjab", 
//             country:"6429e1e9bcaa5e4087638e6c",
//         }
//     ]
//     )
// document1.save();
// module.exports=airportData;
