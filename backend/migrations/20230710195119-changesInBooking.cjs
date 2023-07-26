module.exports = {
    async up(db) {
      await db.collection('booking').updateMany({}, { $set: { cfdId: [] ,dateCreated:''} });
    },
  
    async down(db) {
      await db.collection('booking').updateMany({}, { $unset: { cfdId: '',dateCreated:'' } });
    }
  };
  