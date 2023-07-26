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
import jsonwebtoken from 'jsonwebtoken'

let client;
(async () => {
  client = redis.createClient();
//     {legacyMode: true
//   }


  client.on('error', (err) =>console.error(`Error : ${err}`));

  await client.connect();
  console.log("connected redis")
  
})();
export const signup=async(req,res)=>{
    try{
        const{Name,email,password,gender,custType,org,phNum}=req.body;
        const userlog=await user.findOne({email:email});
        if(userlog){
              return res.status(200).send({message:"Account already exists!! Please login",status:"login"})
        }
        
        const hashedPassword=await bcrypt.hash(password,10);

        const new_user=await user.create({email:email,phNum:phNum,password:hashedPassword,Name:Name,gender:gender,custType:custType,org:org});
        const token=jwt.sign({email:new_user.email,id:new_user._id,name:new_user.name},prcoess.env.SECRET_KEY)
      
        res.cookie("jwt",token,{httpOnly:false});
        res.status(200).send({message:"User created Successfully!!",response:new_user,token:token,status:"success"});
        
    }
    catch(err){
        loggers.create([{ 
            uniqueIdentifier:'signup', 
            errorValue: String(e),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.status(400).send({message:"error ocuured "+err,status:"error"});
    }
};

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            res.send(201).send({message:"Invalid data!!",error:'error'})
        }
        const result=await user.findOne({email:email});
        if(!result){
            return res.status(200).send({message:"signup",error:"User not exists. Please signup"});
        }
        else{
            const matchedPassword=await bcrypt.compare(password,result.password);
            if(!matchedPassword){
                res.status(400).send({message:"invalid credentials",error:"Invalid Credentials!!"});
            }
            else{
                const token = jsonwebtoken.sign({ userId: result._id }, process.env.SECRET_KEY, { expiresIn: '24h' });        
                res.status(200).send({message:"succesfully login",error:'NA',token:token,userId:result._id});
   }
}

}

    catch(e){
        console.log("e is>>",e)
        loggers.create([{ 
            uniqueIdentifier:'login', 
            errorValue: String(e),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        res.status(400).send({message:"exception ocurred",error:String(e)});
    }
};
export const forgotPassword=async(req,res)=>{
    try{
        console.log("req.headers is in forgotPassword ",req.headers);

    }
    catch(err){
        console.log("err",err);
    }
}
export const passwordResetget=async(req,res)=>{
    try{
        console.log("req.headers is in passwordReset get ",req.headers);
        const userlog=jwt.verify(req.headers['cookie'].split("=")[1],process.env.SECRET_KEY);
        console.log("user in get",userlog,req.headers['token']);
        const userId=userlog.id;
        if(!userlog){
            res.status(200).send({Error:"Error",Message:"Some Error ocurred"});
        }
        res.render('forget-Password', {
            email:userlog.email
            });

        // res.status(200).send({Error:"NA get",headers:userId,id:req.headers['id']});
    }
    catch(err){
        loggers.create([{ 
            uniqueIdentifier:'passwordReset get', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        console.log("kkk err",err);
        res.status(400).send({Error:err});
    }
};

export const passwordResetpost=async(req,res)=>{
    try{
        console.log("iside passwordReset post request",req.body,"req.headers",req.headers)
        // const document1=await user.findOne({email:'test11@gmail.com'})
        // document1.password=req.body['password'];
        // document1.save();
        const hashedPassword=await bcrypt.hash(req.body['password'],10);
        console.log("hashedPassword",hashedPassword)
        const document1=await user.update({email:req.body['email']},{$set:{['password']:hashedPassword}});
        console.log({document1})
        res.status(200).send({Error:"NA",Status:"Success"})
    }
    catch(err){
        loggers.create([{ 
            uniqueIdentifier:'passwordReset post', 
            errorValue: String(err),
            DateCreated:Date.now(),
            DateModified:Date.now(),
        }])
           .then(result => {
            console.log(result)
        })
        console.log("err in passwordReset post",err)
        res.status(400).send({Error:"err",Status:"Fail"})
    }
};

