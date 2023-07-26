import jwt from 'jwt-decode'
import redis from 'redis'
import mongoose from 'mongoose';
import moment from "moment";

import promisify from 'util.promisify/implementation.js';
import pkg from 'config'
const  util  = pkg;
import crypto from "crypto"
import user from "../Models/User.js"
import loggers from "../Models/Loggers.js";
import airportData from "../Models/AirportTable.js";
import  airlinesDetails  from "../Models/AirlinesData.js";
import flightDetails from "../Models/FlightDetails.js";
import customerFlightDetails from '../Models/CustomerFlightDetails.js';
import flightStatus from '../Models/FlightStatus.js';
let client;
(async () => {
  client = redis.createClient();



  client.on('error', (err) =>console.error(`Error : ${err}`));

  await client.connect();
  console.log("connected redis")
  
})();

export const fetchCities=async(req,res)=>{
    try{
       
        var citiesData;
        try{
        const dataFromCache=await client.get('citiesData')
        if(dataFromCache){
        citiesData=JSON.parse(dataFromCache);
        }
        else{
        citiesData=await airportData.find({city:{$ne:null}});
        await client.set('citiesData',JSON.stringify(citiesData),{
        Ex:3600
        });
        console.log("here22")
        }
      

        }
        catch(e){
            res.send({Error:"Error in caching",Status:String(e)})
        }
      
            res.send({Error:"No Error",Status:citiesData})
    }
    
    catch(e){
        console.log({e}, "in getDataFromExternal")
        loggers.create([{ 
            uniqueIdentifier:'fetchCities', 
            errorValue: String(e),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.send({Error:String(e),Status:"Error"})
    }
};

export const fetchFlights=async(req,res)=>{
      try{
      let result=[]
      var today=moment(req.body['date']).format('YYYY-MM-DD');

      var flightDataFromCache=await client.get('flightsDetails');
    
    flightDataFromCache=null;
      if (flightDataFromCache==null){
          const fetchedData1=await flightDetails.find({toCity:req.body['toCity'],fromCity:req.body['fromCity']
          ,departureTime:{ $gte: `${today}T00:00:00.000Z`,
          $lt: `${today}T23:59:59.999Z`}
      }).populate('airlineId').populate('airportId').lean().exec()
          
          client.set('flightsDetails',JSON.stringify(fetchedData1),'EX',180);//setEx for setting cachetime in seconds
          flightDataFromCache=fetchedData1;
          console.log("here22")
          
      }    
      

      (typeof flightDataFromCache)=='string'? flightDataFromCache=JSON.parse(flightDataFromCache) :null;

  
      res.send({Error:"NA",Status:flightDataFromCache
  
    });
      
  }
  catch(e){
      console.log({e},e)
      loggers.create([{ 
          uniqueIdentifier:'fetchFlights', 
          errorValue: String(e),
          DateCreated:Date.now(),
          DateModified:Date.now(),
          refValue1:JSON.stringify(req.body)
      }])
         .then(result => {
          console.log(result)
      })
      res.send({Error:String(e),Status:"Error"})
  }
  
}


export const fetchProfileDetails=async(req,res)=>{
  try{
      const userId=req.params.userId;
      if(userId==undefined || userId=='' ){
        res.send({Error:'Error in userId'});
      }
      const userData = await user.findById(userId).select('-password').exec();

      res.send({Error:'NA',userData:userData});


  }
  catch(err)
  {
    console.log("err",err);
    
    loggers.create([{ 
      uniqueIdentifier:'fetchProfileDetails', 
      errorValue: String(err),
      DateCreated:Date.now(),
      DateModified:Date.now(),
      refValue1:JSON.stringify(req.params)
  }])
     .then(result => {
      console.log(result)
  })
  res.send({Error:String(err),Status:"Error"})


  }

}

export const fetchAllBookings=async(req,res)=>{
  try{
      const userId=req.params.userId;
      const data=await customerFlightDetails.find({userId:mongoose.Types.ObjectId(userId)}).populate('checkedInBaggageId')
      .populate('paymentId').populate('userId')
      .populate({
        path: 'flightId',
        select: '-seats', // Exclude the 'seats' field
      })
      .lean().exec();
      res.send({Error:'NA',data:data})

  }
  catch(err){
    console.log("err",err);

    loggers.create([{ 
      uniqueIdentifier:'fetchAllBookings', 
      errorValue: String(err),
      DateCreated:Date.now(),
      DateModified:Date.now(),
      refValue1:JSON.stringify(req.params)
  }])
     .then(result => {
      console.log(result)
  })
  res.send({Error:String(err),Status:"Error"})
 }
}

export const changeFlightStatus=async(req,res)=>{
  try{
    const {id,status,date,userId}=req.body;
    if(status=='D' && date!=undefined && date.arrival!=='' && date.departure!==''){
      const g=await flightStatus.find({flightId:mongoose.Types.ObjectId(id)});
      //update departureTime and rrivaleTIme in flightdetails also
      const updatedFlightDetails=await flightDetails.findOneAndUpdate({_id:mongoose.Types.ObjectId(id)},{$set:{departureTime:new Date(Date.parse(date.departure)),arrivalTime:new Date(Date.parse(date.arrival))}},{new:true}).lean().exec();
      console.log("d is",updatedFlightDetails);
      const flightData=await flightStatus.findOneAndUpdate({flightId:mongoose.Types.ObjectId(id)},{$set:{Status:status,NewTakeOffTime:new Date(Date.parse(date.departure)),
        NewArrivalTime:new Date(Date.parse(date.arrival))
      }});
      console.log("flightData is",flightData);

    }
    else{
      const flightData=await flightStatus.updateOne({flightId:mongoose.Types.ObjectId(id)},{$set:{Status:status}});
      console.log("flightData is",flightData);

    }

    const logsForStatusChange=new loggers({
      uniqueIdentifier:'changeFlightStatus', 
      DateCreated:Date.now(),
      DateModified:Date.now(),
      refValue1:`Status Changed as ${status} done by ${userId}`
    })
    await logsForStatusChange.save();
    console.log("logsForStatusChangeis",logsForStatusChange);

    res.send({Error:'NA',Status:'Success'})

  }
  catch(err){
    console.log("err",err);
    loggers.create([{ 
      uniqueIdentifier:'changeFlightStatus', 
      errorValue: String(err),
      DateCreated:Date.now(),
      DateModified:Date.now(),
      refValue1:JSON.stringify(req.params)
  }])
     .then(result => {
      console.log(result)
  })
  res.send({Error:String(err),Status:"Error"})
  }
}
