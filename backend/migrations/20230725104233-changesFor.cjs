module.exports={
    async up(db, client) {
    await db.collection('customerFlightDetails').updateMany({},{$set:{flightLanded:false}})
},

async down(db, client) {
    await db.collection('customerFlightDetails').updateMany({},{$set:{flightLanded:false}})
}
}
