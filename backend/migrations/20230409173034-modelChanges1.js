module.exports = {
  async up(db, client) {
    await db.collection('airlinesDetails').updateOne({}, {$set: {name:""}})   
     await db.collection('flightDetails').updateOne({},{$unset:{journeyTime:""}})
  },

  async down(db, client) {
    await db.collection('airlinesDetails').updateOne({}, {$set: {name:""}})
    await db.collection('flightDetails').updateOne({},{$unset:{journeyTime:""}})

  }
};
