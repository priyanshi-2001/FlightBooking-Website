module.exports = {
    async up(db) {
      await db.collection('customerFlightDetails').updateMany({}, { $unset: { userId: '', cpdId: '', bookedBy: '' } });
      await db.collection('booking').updateMany({},{$set:{userId:'',cfdId:'',ref1:'',ref2:'',ref3:''}});
    },
  
    async down(db) {
      await db.collection('customerFlightDetails').updateMany({}, { $set: { userId: null, cpdId: null, bookedBy: null } });
    
    }
  };
  