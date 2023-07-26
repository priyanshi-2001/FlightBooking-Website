// const jwt=require('jsonwebtoken')
// const crypto = require("crypto");
// const UserLog=require('../Models/User');
// const bcrypt=require('bcrypt')
// const logger=require('../Models/Loggers')
// import { JsonWebTokenError } from "jsonwebtoken";
import jwt from 'jwt-decode'
import redis from 'redis'
// import express from "express";
import mongoose from 'mongoose';
// var app = express();
// import bodyParser from "body-parser";
import moment from "moment";
// // const bodyParser=require('body-parser')
// app.use(bodyParser.urlencoded())
// app.use(
//     bodyParser.urlencoded({
//       extended: true
//     })
//   );
// // import cors from 'cors';
// app.use(cors());

// import { verify } from 'jsonwebtoken';
// import { Jwt } from 'jsonwebtoken';
// import promisify from 'util.promisify';
import promisify from 'util.promisify/implementation.js';
import pkg from 'config'
const  util  = pkg;
// import promisify from 'util.promisify';
import crypto from "crypto"
import user from "../Models/User.js"
import loggers from "../Models/Loggers.js";
import airportData from "../Models/AirportTable.js";
import  airlinesDetails  from "../Models/AirlinesData.js";
import flightDetails from "../Models/FlightDetails.js";
import { ObjectId } from 'mongoose';
import country from '../Models/Country.js';
import customerPersonalDetail from '../Models/CustomerPersonalDetail.js';
import customerFlightDetails from '../Models/CustomerFlightDetails.js';
import baggageDetails from '../Models/BaggageData.js';
import seatClass from "../Models/SeatNumber.js"
import bookingDetails from '../Models/Booking.js';
import flightStatus from '../Models/FlightStatus.js';
export const fetchSingleFlightData=async(req,res)=>{
try{

const data=await flightDetails.find({_id:mongoose.Types.ObjectId(req.body.id)});
res.send({Error:"NA",Status:data[0]});
}
catch(err){
    console.log(err,"iside fetchSingleFlightData")
    loggers.create([{ 
        uniqueIdentifier:'fetchSingleFlightData', 
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


export const fetchCountries=async(req,res)=>{
    try{
        const data=await country.find().distinct('CountryName');
        res.send({Error:"NA",Status:data})
    }
    catch(err){
        console.log(err,"fetchCountries")
        loggers.create([{ 
            uniqueIdentifier:'fetchCountries', 
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

export const fetchOccupations=async(req,res)=>{
    try{
        const data=await customerPersonalDetail.schema.path('occupation').enumValues
        res.send({Error:"NA",Status:data})
    }
    catch(err){
        console.log(err,"fetchOccupations")
        loggers.create([{ 
            uniqueIdentifier:'fetchOccupations', 
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

export const addDataForBooking=async(req,res)=>{
    try{
    
    if(req.body.length==0 || req.body.length===undefined){
        res.send({Error:'Error in body'})
    }
     let listOfIds=[];
     let cfdIdsList=[];
     for(let i=0;i<req.body.length;i++){
        var details=req.body[i];
        const createdDatainFlightsData=new customerFlightDetails({
            userId:mongoose.Types.ObjectId(details.userId),
            name:details.fname +" "+details.lname,
            email:details.email,
            age:details.age,
            gender:details.gender,
            address:details.address,
            phNum:details.mobileNo,
            flightId:mongoose.Types.ObjectId(details.flightId),
            bookedOn:new Date(),
            seatClass:details.seatClass,
            bookedBy:details.userId,
            categoryOfBooking:details.fareCategory
        })
      await createdDatainFlightsData.save();//save all passengers details in cpd
      cfdIdsList.push(createdDatainFlightsData._id);
      
      

    


      console.log({createdDatainFlightsData},"createdDatainFlightsData")

    }
    const bookingRecord=new bookingDetails({
        userId:mongoose.Types.ObjectId(req.body[0].userId),
        cfdId:cfdIdsList,
        dateCreated:new Date()

    })
    await bookingRecord.save();
    const h=await bookingDetails.find({_id:bookingRecord._id}).populate('cfdId');
      res.send({Error:"NA",Status:"success",listOfIds:cfdIdsList,bookingId:bookingRecord._id});
    }
    catch(err){
        console.log(err,"addDataForBooking")
        loggers.create([{ 
            uniqueIdentifier:'addDataForBooking', 
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

export const saveBaggageData=async(req,res)=>{
    try{
        const idsMap=new Map();//to store id of customer flight details table
        for(let i=0;i<req.body.length;i++){
            const data=req.body[i];
            const objId=mongoose.Types.ObjectId(data.flightId);
           if(data.weight!='' && data.weight!=undefined && data.weight!=NaN && data.weight!=0){
            const newBaggageData=new baggageDetails({
                flightId:objId,
                userId:data.userId,
                reference1:data.cfdId,
                weight:data.weight!='' && data.weight!=undefined?data.weight : 0,
                extraPriceForBaggage:data.extraWeightPrice
            })
            await newBaggageData.save();
            
            const updatedCPD=await customerFlightDetails.findOneAndUpdate({_id:data.cfdId},{$set:{extraBaggageBooked:'Y',checkedInBaggageId:newBaggageData._id}},{new:true});
           console.log("updatedCPD",updatedCPD,"newBaggageData",newBaggageData)
           idsMap.set(data.cfdId,newBaggageData._id);
        }
        else{
            const updatedCPD=await customerFlightDetails.findOneAndUpdate({_id:data.cfdId},{$set:{extraBaggageBooked:'N'}});
            console.log("updatedCPD",updatedCPD);
        }

        }

        res.send({Error:"NA",Status:"success",listOfIds:Object.fromEntries(idsMap)})
        



    }
    catch(err){
        console.log(err,"saveBaggageData")
        loggers.create([{ 
            uniqueIdentifier:'saveBaggageData', 
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

export const fetchFoodPrices=async(req,res)=>{
    try{
        const airlineId=req.body['airlineId'];
        const data=await airlinesDetails.find({_id:mongoose.Types.ObjectId(airlineId)});
        console.log("data",data);

        res.send({Error:"NA",Status:"success",food:JSON.parse(data[0].food),costOfBaggage:JSON.parse(data[0].costOfBaggage),discounts:JSON.parse(data[0].discounts),numOfSeats:data[0].numOfSeats});

    }
    catch(err){
        console.log("err",err);
        loggers.create([{ 
            uniqueIdentifier:'fetchFoodPrices', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.send({Error:String(err),Status:"Error"})

    }
}

export const saveFoodData=async(req,res)=>{
    try{
    for(let i=0;i<req.body['data'].length;i++){
        const updatedCPD=await customerFlightDetails.findOneAndUpdate({_id:req.body['data'][i]['cfdId']},{$set:{foodPrice:req.body['data'][i]['foodPrice'],foodBooked:req.body['data'][i]['foodBooked']}});
        console.log("updatedCPD",updatedCPD);
    }

    res.send({Error:"NA",Status:"success"});
    }
    catch(err){
        console.log("err",err);
        loggers.create([{ 
            uniqueIdentifier:'saveFoodData', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.send({Error:String(err),Status:"Error"})
    }
}

export const saveEditedDetails=async(req,res)=>{
    try{
        const details=req.body.data;
        const v=req.body.valueEdited;
        let editSaveQuery={};
        let data;
        for(let i=0;i<details.length;i++){
            data=details[i];
            const flightId=mongoose.Types.ObjectId(data.flightId);
            const cpdId=mongoose.Types.ObjectId(data.cpdId);
            const updatedData=await customerPersonalDetail.findOneAndUpdate({_id:cpdId},{$set:{firstName:
              data.fname,lastName:data.lname,age:data.age,mobileNo:data.mobileNo,emailId:data.email,address:data.address,
              occupation:data.occupation,DateModified:Date.now()
            }});
            console.log("updatedData",updatedData);

            const updatedDataOfCFD= await customerFlightDetails.findOneAndUpdate({flightId:flightId,cpdId:cpdId},{$set:{categoryOfBooking:data.fareCategory,seatClass:data.seatClass}});
            console.log("updatedDataOfCFD",updatedDataOfCFD);

            
        }

        res.send({Error:"NA",Status:"success"});

    }
    catch(err){
        console.log("err",err);
        loggers.create([{ 
            uniqueIdentifier:'saveEditedDetails', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.send({Error:String(err),Status:"Error"})
    }
}

export const fetchSeatsData=async(req,res)=>{
    try{
        // const rows = 50; // Number of rows
        // const columns = 6; // Number of columns
        // const seats = [];
        // for (let row = 1; row <= rows; row++) {
        // for (let column = 0; column < columns; column++) {
        //     const seat = `${row}${String.fromCharCode(65 + column)}`;
        //     seats.push({
        //     seatNumber: seat,
        //     isBooked: false,
        //     passenger: null,
        //     bookedBy:null,
        //     seatPrice:column==0 || column==5?'100':'0'
        //     });
        // }
        // }
        // const updatedFlight1= await flightDetails.findByIdAndUpdate(
        //     req.query.cfdId,
        //     { $set: { seats: [] }},
        //     {new:true}
        //     ).lean().exec();

        // const updatedFlight = await flightDetails.findByIdAndUpdate(
        // req.query.cfdId,
        // { $push: { seats: { $each: seats } }},
        // {new:true}
        // ).lean().exec();
        // console.log("uu",updatedFlight);
       
        const seatsData=await flightDetails.find({_id:req.query.cfdId},{_id:0,seats:1}).lean().exec();


      
        res.send({Error:"NA",Status:seatsData})

    }
    catch(err){
        console.log("err",err);
        loggers.create([{ 
            uniqueIdentifier:'fetchSeatsData', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.send({Error:String(err),Status:"Error"})
    }
}

export const selectSeat=async(req,res)=>{
    try{
        const {flightId,seatNumber,userId,cfdId}=req.body;
        //to test middlewares findOneAndUpdate and save
        // const z=await flightStatus.find({flightId:flightId});
        // console.log("z is",z);
        // const y=await flightStatus.findOneAndUpdate({flightId:flightId},{$set:{Status:'OC'}});
        // console.log("y is",y);
        if(flightId==undefined || seatNumber==undefined || userId==undefined || cfdId==undefined || cfdId==''){
           return res.status(400).send({Error:'Error in body'})
        }
        //check if its occupied already
        const session=await mongoose.startSession();
        session.startTransaction();
        try{
        const flight = await flightDetails.findOne(
            { _id: flightId, "seats.seatNumber": seatNumber },
            null,//projection to show all fields of document
            {session}
          ).exec();
        const seat = flight.seats.find((seat) => seat.seatNumber === seatNumber);
        if (seat.isBooked) {
            //seat is taken by some user 
            session.abortTransaction();
            session.endSession();
            console.log("Seat is already booked");
             return res.status(200).send({Error:'Seat allocated to other user'});
          }
        
         //allocate this seat to the user
          seat.isBooked = true;
          seat.passenger=mongoose.Types.ObjectId(cfdId);
          seat.bookedBy = mongoose.Types.ObjectId(userId);
          
          await flight.save();
          await session.commitTransaction();
          session.endSession();
          const updatedCPD=await customerFlightDetails.findOneAndUpdate({_id:cfdId},{$set:{seatNumber:seatNumber,seatPrice:seat.seatPrice}},{new:true});
          console.log("updatedCPD",updatedCPD);
          const updatedCPD2=await customerFlightDetails.find({_id:cfdId});
          console.log("updatedCPD2",updatedCPD2);
          return res.status(200).send({Error:'NA',Status:flight,price:seat.seatPrice});
        }
        catch(err){
            session.abortTransaction();
            session.endSession();
            loggers.create([{ 
                uniqueIdentifier:'selectSeat', 
                errorValue: String(err),
                refValue1:'Error in transaction',
                DateCreated:Date.now(),
                DateModified:Date.now(),
            }])
               .then(result => {
                console.log(result)
            })
            return res.status(200).send({Error:'Some Error ocurred'});
        }


    }
    catch(err){
        console.log("err",err);
        loggers.create([{ 
            uniqueIdentifier:'selectSeat', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        return res.status(200).send({Error:String(err),Status:"Error"})
    }
}