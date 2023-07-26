import jwt from 'jwt-decode'
import pkg from 'config';
import bcrypt from 'bcrypt'
const { util } = pkg;
import promisify from 'util.promisify';
import crypto from "crypto"
import user from "../Models/User.js"
import redis from 'redis'
import loggers from "../Models/Loggers.js";
import airportData from "../Models/AirportTable.js";
import  airlinesDetails  from "../Models/AirlinesData.js";
import flightDetails from "../Models/FlightDetails.js";
import customerFlightDetails from '../Models/CustomerFlightDetails.js';
import mongoose from 'mongoose';
import flightStatus from '../Models/FlightStatus.js';
import sendEmailUtility from '../util/sendEmailUtility.js';
export const fetchMyFlight=async(req,res)=>{
    try{
        const {userId}=req.params;

        const flightsData=await customerFlightDetails.find({userId:mongoose.Types.ObjectId(userId),flightLanded:false}).populate( {path: 'flightId',
        select: '-seats'}).lean().exec();
        var tempFlightsData=flightsData;
        var flightIdsList=new Set();
        flightsData.map((o)=>flightIdsList.add(o.flightId._id));
        const y=await flightStatus.find({_id:mongoose.Types.ObjectId('6435b1d5766dc5ae31a8ada7')});
        const m=await flightStatus.find({flightId:mongoose.Types.ObjectId('6435b1d5766dc5ae31a8ada7')})
        flightIdsList=Array.from(flightIdsList);
        const data=await flightStatus.find({flightId:{$in:flightIdsList}});
        flightsData.map((o)=>o.flightStatus=data.filter((m)=>m.flightId.toString()==o.flightId._id.toString()))
        flightsData.map((o)=>(o.flightStatus[0].Status=='OWC' || o.flightStatus[0].Status=='CWC') && (o.webCheckedIn==undefined || o.webCheckedIn==false)? o.showWebCheckIn=true :o.showWebCheckIn=false)
        res.send({Error:'NA',flightsData:flightsData});
    }
    catch(err){
        console.log("err",err);
        loggers.create([{ 
            uniqueIdentifier:'fetchMyFlight', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.send({Error:String(e),Status:"Error"})

    }
}

export const webCheckIn=async(req,res)=>{
    try{
        const{userId,cfdId}=req.body;
        const cfdData=await customerFlightDetails.findById(cfdId).lean().exec();
        // if(cfdData.userId==userId && (cfdData.webCheckIn==undefined || cfdData.webCheckIn==false)){
        // const updatedData=await customerFlightDetails.findOneAndUpdate({_id:mongoose.Types.ObjectId(cfdId)},{$set:{webCheckedIn:true}},{new:true});
        // console.log("pp",updatedData);
        // }
        const updatedData=await customerFlightDetails.findById(cfdId).populate('flightId').lean().exec();
        console.log("kk",updatedData);
        await sendEmailUtility.sendBoardingPass(updatedData);
        res.send({Error:'NA',Status:'Success'});
    }
    catch(err){
        console.log("err is",err);
        loggers.create([{ 
            uniqueIdentifier:'webCheckIn', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.send({Error:String(e),Status:"Error"})

    }
}

