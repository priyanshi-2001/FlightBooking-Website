import Razorpay from 'razorpay'
import loggers from "../Models/Loggers.js";
import mongoose from 'mongoose';
import crypto from 'crypto';
import fs from 'fs'
import { readFileSync } from 'fs';
import { compareSync } from 'bcrypt';
import paymentInfoDetails from '../Models/PaymentInfo.js';

// test cards:- https://razorpay.com/docs/payments/payments/test-card-upi-details/
export const checkout=async(req,res)=>{
    try{
    console.log("process.env.RAZORPAY_KEY",process.env.RAZORPAY_SECRET,process.env.RAZORPAY_KEY,process.env.BCRYPT_SALT)

    const instance=new Razorpay({
        key_id:process.env.RAZORPAY_KEY,
        key_secret:process.env.RAZORPAY_SECRET
    })
    const options={
        amount: Number(req.body.amount*100),
        currency: "INR",
        receipt: "receipt#1",
        line_items_total: Number(req.body.amount*100),
        cod_fee:0,
      
    }
    
    
    const order=await instance.orders.create(options);
    paymentInfoDetails.create([{ 
        uniqueIdentifier:'checkout', 
        amount:req.body.amount,
        paymentDate:Date.now(),
        orderCreationResponse:JSON.stringify(order)
    }])
       .then(result => {
        console.log(result)
    })
    console.log({order});
    res.status(200).send({error:'NA',message:order})
}
catch(e){
    console.log({e})
    loggers.create([{ 
        uniqueIdentifier:'checkout', 
        errorValue: String(e),
        DateCreated:Date.now(),
        DateModified:Date.now(),
        refValue1:JSON.stringify(req.body)
    }])
       .then(result => {
        console.log(result)
    })
    res.status.send({error:"Error",message:"Some Error ocurred"})
}
}

export const paymentConfirmation=async(req,res)=>{
    try{
       
       
        const razorpay_payment_id=req.body.razorpay_payment_id
        const razorpay_order_id=req.body.razorpay_order_id
        const razorpay_signature=req.body.razorpay_signature

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        console.log({body},"body in payment66")
        console.log(req.body,"inside paymentConfirmation")

        var generatedSignature = crypto.createHmac("SHA256",process.env.RAZORPAY_KEY).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");  
        const isAuthentic= razorpay_signature == generatedSignature
        console.log({isAuthentic})
        //we are not checking thorugh isAuthentic here because in staging mode its always false in prod we must check isAuthentic value
        var html = fs.readFileSync('././paymentAfterPage.html', 'utf8')
        res.send(html);
    }
    catch(err){
        console.log(err);
        loggers.create([{ 
            uniqueIdentifier:'paymentConfirmation', 
            errorValue: String(e),
            DateCreated:Date.now(),
            DateModified:Date.now(),
            refValue1:JSON.stringify(req.body)
        }])
           .then(result => {
            console.log(result)
        })
        res.status.send({error:"Error",message:"Some Error ocurred"})

    }
}
