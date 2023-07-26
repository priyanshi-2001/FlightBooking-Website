
module.exports={
    async up(db, client) {
   
    await db.collection('flightStatus').updateMany({},{$set:{flightId:'',countryId:'',Status:'',ScheduledTakeOffTime:'',ScheduledArrivalTime:'',NewTakeOffTime:'',NewArrivalTime:''}});
},

async down(db, client) {
    await db.collection('flightStatus').updateMany({},{$set:{bookedBy:''}})

}
}
