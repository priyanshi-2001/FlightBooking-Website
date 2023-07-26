module.exports = {
  async up(db, client) {
    return(
      await db.collection('airlinesDetails').updateOne({}, {$set: {model:""}}),
    await db.collection('airportData').updateMany({},{$set: {state:""}}),
    await db.collection('baggageDetails').updateMany({},{$set: {weight:""}}),
    await db.collection('customerFlightDetails').updateMany({},{$set: {seatPrice:""}}),
    await db.collection('customerPersonalDetail').updateMany({},{$set: {lastName:""}}),
    await db.collection('flightDetails').updateMany({},{$set: {fromCity:""}}),
    await db.collection('flightStatus').updateMany({},{$set: {Status:"OT"}}),
    await db.collection('seatClass').updateMany({},{$set: {seatNo:""}}),
    await db.collection('loggers').updateMany({},{$set: {refValue1:""}})
    )
  },

  async down(db, client) {
    return(
      await db.collection('airlinesDetails').updateOne({}, {$set: {model:""}}),
    await db.collection('airportData').updateMany({},{$set: {state:""}}),
    await db.collection('baggageDetails').updateMany({},{$set: {weight:""}}),
    await db.collection('customerFlightDetails').updateMany({},{$set: {seatPrice:""}}),
    await db.collection('customerPersonalDetail').updateMany({},{$set: {lastName:""}}),
    await db.collection('flightDetails').updateMany({},{$set: {fromCity:""}}),
    await db.collection('flightStatus').updateMany({},{$set: {Status:"OT"}}),
    await db.collection('seatClass').updateMany({},{$set: {seatNo:""}}),
    await db.collection('loggers').updateMany({},{$set: {refValue1:""}})
    )
  }
};
