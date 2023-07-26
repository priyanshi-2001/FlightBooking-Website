import express from "express";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import NodeCache from "node-cache";
const myCache = new NodeCache();
import redis from 'redis'
import fetch from "node-fetch";
import { config } from "dotenv";
import {authorize} from '../middleware/authentication.js';
config({ path: "../config/config.env" });
import {fetchMyFlight,webCheckIn} from '../controllers/webCheckIn.js';
import  {fetchCities,fetchFlights,fetchProfileDetails,fetchAllBookings,changeFlightStatus} from '../controllers/fetchFlightData.js'
import {fetchSingleFlightData,fetchCountries,fetchOccupations,addDataForBooking,saveBaggageData,fetchFoodPrices,saveFoodData,saveEditedDetails,fetchSeatsData,selectSeat} from "../controllers/booking.js";
import {signup,passwordResetget,forgotPassword,login,passwordResetpost} from '../controllers/signupLogin.js'
import { checkout,paymentConfirmation } from "../controllers/payment.js";
import paymentInfoDetails from "../Models/PaymentInfo.js";
import cors from 'cors';
var app = express();
import bodyParser from "body-parser";
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
app.use(bodyParser.json());
app.use(cors());
import { ObjectId } from "mongoose";
import nodemailer from 'nodemailer'
import cookieParser from "cookie-parser";
const bcryptSalt =process.env.BCRYPT_SALT;
import jwt from 'jwt-decode'
import prices from "../Models/Prices.js";
import user from "../Models/User.js";
import crypto from 'crypto'
import country from '../Models/Country.js'
import loggers from "../Models/Loggers.js";
import airportData from "../Models/AirportTable.js";
import  airlinesDetails  from "../Models/AirlinesData.js"
import flightDetails from "../Models/FlightDetails.js";
const router = express.Router();
let client;
(async () => {
  client = redis.createClient();
//     {legacyMode: true
//   }


  client.on('error', (err) =>console.error(`Error : ${err}`));

  await client.connect();
  console.log("connected redis")
  
})();

import rateLimit from 'express-rate-limit'
import moment from "moment";
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, 
  message: JSON.stringify({error:'You have exceeded the 2 requests in 24 hrs limit!',message:"Too many requests"}),// Disable the `X-RateLimit-*` headers
})


router.get("/",(req,res)=>{
    res.send("HEY ITS ROOT PAGE")
})


router.route("/fetchCities").get(authorize,fetchCities)
router.route("/fetchFlights").post(authorize,fetchFlights)
router.route("/signup").post(signup)
router.route("/forgot-password").post(forgotPassword)
router.route("/passwordReset/:token/:id").get(passwordResetget)
router.route("/passwordReset/:token/:id").post(passwordResetpost)
router.route("/login").post(login)
// router.use('/checkout', apiLimiter) //--->this is based on ip address so we are not going to use it because it fails in case of 
//we have two algorithms to prevent hackers attack or too much server load by token algo or bucket leak algo
//also we can do api signing using sha256 in each api so that any fraud not happens
//https://blog.andrewhoang.me/how-api-request-signing-works-and-how-to-implement-it-in-nodejs-2/
//https://www.youtube.com/watch?v=s3oNuytPHss
router.route("/checkout").post(authorize,checkout)
router.route("/paymentConfirmation").post(authorize,paymentConfirmation)
router.route("/fetchSingleFlightData").post(authorize,fetchSingleFlightData)
router.route("/fetchCountries").get(authorize,fetchCountries)
router.route("/fetchOccupations").get(authorize,fetchOccupations)
router.route("/addDataForBooking").post(authorize,addDataForBooking)
router.route("/saveBaggageData").post(authorize,saveBaggageData)
router.route("/foodFetch").post(authorize,fetchFoodPrices)
router.route("/saveFoodData").post(authorize,saveFoodData)
router.route("/saveEditedDetails").post(authorize,saveEditedDetails)
router.route("/fetchSeatsData").get(authorize,fetchSeatsData)
router.route("/selectSeat").post(authorize,selectSeat)
router.route("/fetchProfileDetails/:userId").get(authorize,fetchProfileDetails)
router.route("/fetchAllBookings/:userId").get(authorize,fetchAllBookings)
router.route("/changeFlightStatus").post(authorize,changeFlightStatus)
router.route("/fetchMyFlight/:userId").get(authorize,fetchMyFlight)
router.route("/webCheckIn").post(authorize,webCheckIn)
// module.exports=router;
export default router;
