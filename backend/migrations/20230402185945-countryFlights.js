module.exports = {
  async up(db, client) {
    return db.collection('country').updateMany({}, {$set: {CountryName:""}});
  },

  async down(db, client) {
    
  }
};
