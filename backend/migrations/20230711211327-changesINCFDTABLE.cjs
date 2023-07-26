module.exports={
    async up(db, client) {
    await db.collection('customerFlightDetails').updateMany({},{$set:{checkedInBaggageId:'',extraBaggageBooked:''}})
},

async down(db, client) {
    await db.collection('customerFlightDetails').updateMany({},{$set:{email:''}})
}
}
