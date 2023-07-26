
import mongoose from "mongoose";

const Schema=mongoose.Schema
const cpdSchema=new Schema({
firstName:{
    type:String,
},
lastName:{
    type:String,
},
emailId:{
    type:String,
},
occupation:{
    type:String,
    enum: ['Medical', 'Pilot', 'Teacher','Finances',
'Banking','Civil Engineer','Software Engineer','Business Owner','Freelancer','Sports'
]
},
age:{
    type:Number,
},
address:{
    type:String,
},
country:{
    type:{type: Schema.Types.ObjectId, ref: 'country'}
},
DateCreated : { type : Date, default: Date.now },
DateModified : { type : Date, default: Date.now },
mobileNo:{
    type:Number,
},
userId:{
    type:String //this will point to user table id for this user.
}
})
const customerPersonalDetail=new mongoose.model("customerPersonalDetail",cpdSchema);
// const document1=new customerPersonalDetail({
//     firstName:"demo",
//     emailId:"demo23@gmail.com",
// })
// document1.save();
// module.exports=customerPersonalDetail;
export default customerPersonalDetail

// if a user do signup then only we create his record in user tbale and cpd 
