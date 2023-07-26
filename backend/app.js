import express from "express";
import cron from "node-cron"
import cors from "cors"
import NodeCache from 'node-cache';
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import mongoose from 'mongoose';
import { checkout,paymentConfirmation } from "./controllers/payment.js";
import dotenv from 'dotenv';
import {authorize} from './middleware/authentication.js';
dotenv.config();
console.log("kkk",process.env.RAZORPAY_SECRET);
export const app = express();

import fetch from "node-fetch"
import razorpay from 'razorpay'
app.set('view engine', 'ejs');
import cookieParser from 'cookie-parser';
app.use(cookieParser('keyforcookie'));
app.use(cors());
import jwt from 'jwt-decode'
import user from './Models/User.js'
import country from './Models/Country.js';
import airlinesDetails from './Models/AirlinesData.js';
import airportData from './Models/AirportTable.js';
import baggageDetails from './Models/BaggageData.js';
import customerFlightDetails from './Models/CustomerFlightDetails.js';
import customerPersonalDetail from './Models/CustomerPersonalDetail.js';
import bookingDetails from "./Models/Booking.js";
//SET  RAZORPAY_SECRET="value" node.js
//SET SUPPRESS_NO_CONFIG_WARNING=1
import sendEmailUtility from './util/sendEmailUtility.js';
import flightStatus from "./Models/FlightStatus.js";

import {connectDB} from './db/conn.js'
connectDB()
import './Routes/routes.js'
import http from 'http';
import  {Server}  from "socket.io";
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: ["http://localhost:3000","http://localhost:3001"]
  },
});


import router from "./Routes/routes.js";
const port=8000
import bodyParser from "body-parser";
import flightDetails from "./Models/FlightDetails.js";
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);



const flightsData = new Map();
io.on('connection', (socket) => {

  socket.on("flight",(message)=>{
    if(flightsData.get(message.flightId)!=undefined){
    var data = flightsData.get(message.flightId);
    data.set(socket.id,null);
    flightsData.set(message.flightId, data);
    }
    else{
      var newMap=new Map();
      newMap.set(socket.id,null);
      flightsData.set(message.flightId,newMap);
    }
    console.log("flightsData in fligth ",flightsData)
  });

  socket.on("seatBooking",(message)=>{
    console.log("msg is",message,"flightsData",flightsData);
    var data = flightsData.get(message.flightId);
    data.set(socket.id,message.seatNumber);
    flightsData.set(message.flightId, data);
    console.log("flightsData updated is",flightsData,"data is",data);

    Array.from(flightsData.get(message.flightId).keys()).forEach((socketId) => {
      io.to(socketId).emit('newSeatBooked', message.seatNumber);
    });

  })

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
    // flightsData.forEach((data, flightId) => {
    //   if (data.has(socket.id)) {
    //     data.delete(socket.id);
    //     flightsData.set(flightId, data);
    //   }
    // });

  });

  socket.on("error", (error) => {

    console.log("Socket connection error:", error);
  });

}


)

app.use(bodyParser.json());
app.use(router);
user()
country()
airportData()
bookingDetails()
customerFlightDetails()
airlinesDetails()



const job=cron.schedule("*0 */8 * * *", async function() {//run every 8 hours
  try{
  console.log("I am inside cron job");
  
  const fortyEightHoursFromNow = new Date(Date.now() + 48 * 60 * 60 * 1000);
  
  const demo=await flightStatus.updateMany({ NewTakeOffTime: {
    $gte: new Date(),
    $lt: fortyEightHoursFromNow,
  }
},{
  $set:{Status:'OT'}
});
  
  const webCheckInOpenFlights=await flightStatus.updateMany({ NewTakeOffTime: {
      $gte: new Date(),
      $lt: fortyEightHoursFromNow,
    }
  },{
    $set:{Status:'OWC'}
  });
  const updatedData=await flightStatus.find({ NewTakeOffTime: {
    $gte: new Date(),
    $lt: fortyEightHoursFromNow,
  }
}).populate('flightId');
  var flightIdsList=new Map();
updatedData.map((o)=>o.flightId && flightIdsList.set(o.flightId._id.toString(),o.flightId))
  const emailsData=await customerFlightDetails.find({flightId:{$in:Array.from(flightIdsList.keys())}},{email:1,name:1,flightId:1,_id:0});
  if(emailsData.length>0){
  await sendEmailUtility.sendEmailWebCheckIn('OWC',emailsData,flightIdsList)
  }
  }
  catch(err){
    console.log("err",err);

    loggers.create([{ 
      uniqueIdentifier:'web check in cron job 4 hours', 
      errorValue: String(err),
      DateCreated:Date.now(),
      DateModified:Date.now(),
      refValue1:'cron 4 hrs'
  }])
     .then(result => {
      console.log(result)
  })
  }


},
{
  scheduled: false,
  timezone: "Asia/Kolkata"
}
);
// job.start();


const jobForWebCheckInClose=cron.schedule("0 */5 * * *", async function() {//run every 5 hours
  try{
  console.log("I am inside cron job");
  const currentTime = new Date(); 
  const currentTimeUTC = currentTime.toISOString(); 
  const fourHoursFromNow = new Date(currentTime.getTime() + 4 * 60 * 60 * 1000);

  
  const webCheckInOpenFlights=await flightStatus.updateMany({ NewTakeOffTime: {
      $gte: new Date(),
      $lte: fourHoursFromNow.toISOString(),
    }
  },{
    $set:{Status:'CWC'}
  });
  const updatedData=await flightStatus.find({ NewTakeOffTime: {
    $gte: new Date(),
    $lte: fourHoursFromNow.toISOString(),
  }
}).populate('flightId');
  var flightIdsList=new Map();
updatedData.map((o)=>o.flightId && flightIdsList.set(o.flightId._id.toString(),o.flightId))
  const emailsData=await customerFlightDetails.find({flightId:{$in:Array.from(flightIdsList.keys())},webCheckedIn:false},{email:1,name:1,flightId:1,_id:0});
  if(emailsData.length>0){
  await sendEmailUtility.sendEmailWebCheckIn('CWC',emailsData,flightIdsList)
  }
  }
  catch(err){
    console.log("err",err);

    loggers.create([{ 
      uniqueIdentifier:'web check in cron job 4 hours', 
      errorValue: String(err),
      DateCreated:Date.now(),
      DateModified:Date.now(),
      refValue1:'cron 4 hrs'
  }])
     .then(result => {
      console.log(result)
  })
  }


},
{
  scheduled: false,
  timezone: "Asia/Kolkata"
}
);
// jobForWebCheckInClose.start();

const jobForClosedCheckIN=cron.schedule("*/30", async function() {//run every 30 min
  try{
      console.log("I am inside cron job");
      const currentTime = new Date(); 
      const currentTimeUTC = currentTime.toISOString(); 
      const oneHourFromNow = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000);

  
      const webCheckInOpenFlights=await flightStatus.updateMany({ NewTakeOffTime: {
          $gte: new Date(),
          $lte: oneHourFromNow.toISOString(),
        }
      },{
        $set:{Status:'WCC'}
      });
      const updatedData=await flightStatus.find({ NewTakeOffTime: {
        $gte: new Date(),
        $lte: oneHourFromNow.toISOString(),
      }
    }).populate('flightId');
    console.log("updatedData",updatedData);
  }
  catch(err){
    console.log("err",err);

    loggers.create([{ 
      uniqueIdentifier:'jobForClosedCheckIN cron job 30min', 
      errorValue: String(err),
      DateCreated:Date.now(),
      DateModified:Date.now(),
      refValue1:'cron 4 hrs'
  }])
     .then(result => {
      console.log(result)
  })
  }


},
{
  scheduled: false,
  timezone: "Asia/Kolkata"
}
);
// jobForClosedCheckIN.start();

//make one more cron job where only 1 hour left for flight departure 

// The scheduled: false option in the configuration object passed to cron.schedule() ensures that 
// the cron job doesn't start immediately upon creation but waits until job.start() is explicitly called.


server.listen(port,()=>{
    console.log(`connection is set up at ${port}`);

})

