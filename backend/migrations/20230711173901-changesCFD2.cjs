module.exports={
    async up(db, client) {
    await db.collection('customerFlightDetails').updateMany({},{$set:{name:'',checkedInBaggageId:'',seatNumber:'',paymentId:'',email:'',phNum:'',age:'',address:'',gender:''}})
},

async down(db, client) {
    await db.collection('customerFlightDetails').updateMany({},{$set:{email:''}})
}
}
