const subjects= {
  'D': 'Flight Delayed',
  'OWC': 'Flight is Open for Web Check in',
  'CWC': 'Web Check In Closing soon',
};
const templateName={
  'D':'',
  'OWC':'',
  'CWC':''
}
const webCheckInLink='http://localhost:8000/webCheckIn';
import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';
import pdf from 'html-pdf';
import prices from "../Models/Prices.js";
import user from "../Models/User.js";
import crypto from 'crypto';
import country from '../Models/Country.js';
import loggers from "../Models/Loggers.js";
import airportData from "../Models/AirportTable.js";
import  airlinesDetails  from "../Models/AirlinesData.js";
import flightDetails from "../Models/FlightDetails.js";


const sendEmail=async(status,emailsList,flightData,originalDoc)=>{
try{

var sender=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.SENDER_EMAIL,
        pass:process.env.SENDER_EMAIL_PWD
     }
     ,
    port:465,
    host:'smtp.gmail.com'
  });

  for (const obj of emailsList) {
    console.log("email is",obj.email);
    const mailOptions = {
      from: process.env.SENDER_EMAIL, // Sender's email address
      to: 'yacokob435@miqlab.com', // obj.email
      subject:subjects[status],
      // text:`Dear ${obj.name}Your Flight`,
      html: `<div><p>subjects</p>
      Dear ${obj.name},
      Your upcoming ${flightData[0].airlineId.name} Airlines flight ${flightData[0].airlineId._id} from ${flightData[0].fromCity} to ${flightData[0].toCity} is delayed. The timing has been changed from ${originalDoc.NewTakeOffTime.toString().split("GMT")[0]
    } - ${originalDoc.NewArrivalTime.toString().split("GMT")[0]
  }
      to ${flightData[0].departureTime.toString().split("GMT")[0]} - ${flightData[0].arrivalTime.toString().split("GMT")[0]
    }. We apologize for the inconvenience caused.<br/><br/> Thanks.
      
      </div>`,
    };

    try {
      const info = await sender.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.log('Error sending email:', error);
    }
  }

}
catch(ex){
  console.log("ex in sendEmailUtil is",ex);

    loggers.create([{ 
        uniqueIdentifier:'sendEmailUtil', 
        errorValue: String(ex),
        DateCreated:Date.now(),
        DateModified:Date.now(),
    }])
       .then(result => {
        console.log(result)
    })
}
}


const sendEmailWebCheckIn=async(status,emailsData,flightIdsList)=>{
  try{

    
    var sender=nodemailer.createTransport({
      service:'gmail',
      auth:{
          user:process.env.SENDER_EMAIL,
          pass:process.env.SENDER_EMAIL_PWD
       }
       ,
      port:465,
      host:'smtp.gmail.com'
    });

    for (const obj of emailsData) {
      console.log("email is",obj.email);
      const mailOptions = {
        from: process.env.SENDER_EMAIL, // Sender's email address
        to: 'yacokob435@miqlab.com', // obj.email
        subject:subjects[status],
        // text:`Dear ${obj.name}Your Flight`,
        html: `<div><p>subjects</p>
        Dear ${obj.name},
        Your upcoming  flight  from ${flightIdsList.get(emailsData[0].flightId.toString()).fromCity} to ${flightIdsList.get(emailsData[0].flightId.toString()).toCity} at ${flightIdsList.get(emailsData[0].flightId.toString()).departureTime.toString().split("GMT")[0]} -<br/>
        ${flightIdsList.get(emailsData[0].flightId.toString()).arrivalTime.toString().split("GMT")[0]}

        is ${status=='OWC'?'open':'close'} for Web Check in. Click here <a>${webCheckInLink}</a> to Complete the web check in.<br/<<br/> Thanks.
      
    
       
        
        </div>`,
      };
      try {
        const info = await sender.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.log('Error sending email:', error);
      }
    }
  
      

    
   
    


  }
  catch(err){
    console.log("err",err);
    loggers.create([{ 
      uniqueIdentifier:'sendEmailWebCheckIn', 
      errorValue: String(err),
      DateCreated:Date.now(),
      DateModified:Date.now(),
  }])
     .then(result => {
      console.log(result)
  })
  }

}

const sendBoardingPass=async(cfdData)=>{
  try{
    const __filename = import.meta.url.substring(import.meta.url.lastIndexOf('/') + 1);
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const templatePath = path.join(__dirname, 'templates', 'template.html');
    const normalizedTemplatePath = templatePath.slice(1);
    const htmlTemplate = fs.readFileSync(normalizedTemplatePath, 'utf8');
        const filledHtmlTemplate = htmlTemplate
          .replace('{{name}}', cfdData.name)
          .replace('{{flightFrom}}', cfdData.flightId.fromCity)
          .replace('{{flightTo}}', cfdData.flightId.toCity)
          .replace('{{departureTime}}', cfdData.flightId.departureTime.toString().split("GMT")[0])
          .replace('{{arrivalTime}}', cfdData.flightId.arrivalTime.toString().split("GMT")[0]);

        const options = { format: 'Letter', timeout: 10000 };
        const buffer = await new Promise((resolve, reject) => {
          pdf.create(filledHtmlTemplate, options).toBuffer((err, buffer) => {
            if (err) {
              console.log("err",err);
              reject(err);
            } else {
              console.log("buffer is",buffer);
              resolve(buffer);
            }
          });
        });
       

        var sender=nodemailer.createTransport({
          service:'gmail',
          auth:{
              user:process.env.SENDER_EMAIL,
              pass:process.env.SENDER_EMAIL_PWD
          }
          ,
          port:465,
          host:'smtp.gmail.com'
        });
      
        
          const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender's email address
            to: 'dajapay109@muzitp.com', // cfdData.email
            subject:'Web Check In Successful',
            html: `<div><p>subjects</p>
            Dear ${cfdData.name}, Web Check in is Successful for 
            your upcoming  flight from ${cfdData.flightId.fromCity} at ${cfdData.flightId.departureTime.toString().split("GMT")[0]} to ${cfdData.flightId.toCity}
            ${cfdData.flightId.arrivalTime.toString().split("GMT")[0]}.<br/><br/> Thanks.
          
            </div>`,
            attachments: [
              {
                filename: 'Web_CheckIn_Successful.pdf', // Name for the attached PDF file
                content: buffer, // The PDF file as a Buffer
              },
            ],
          };
      
          try {
            const info = await sender.sendMail(mailOptions);
            console.log('Email sent:', info.response);
          } catch (error) {
            console.log('Error sending email:', error);
          }
        }

  catch(err){
    console.log("err",err);
    loggers.create([{ 
      uniqueIdentifier:'sendBoardingPass', 
      errorValue: String(err),
      DateCreated:Date.now(),
      DateModified:Date.now(),
  }])
     .then(result => {
      console.log(result)
  })
  }
}
export default {sendEmail,sendEmailWebCheckIn,sendBoardingPass}
