module.exports = {
    async up(db, client) {
      await db.collection('paymentInfo').updateOne({}, {$set: {cfdId:"",paymentDate:new Date(),amount:"",orderCreationResponse:"",ref1:"",ref2:"",ref3:"",ref4:""}})   
    },
  
    async down(db, client) {
        await db.collection('paymentInfo').updateOne({}, {$set: {cfdId:"",paymentDate:new Date(),amount:"",orderCreationResponse:"",ref1:"",ref2:"",ref3:"",ref4:""}})   

  
    }
  };
  