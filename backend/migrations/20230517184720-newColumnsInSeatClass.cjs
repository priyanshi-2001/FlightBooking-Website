module.exports={
   async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('seatClass').updateMany({},{$set:{seatNo:'1A:{"status":"B","isCorner":"True"}'}})
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
},

async down(db, client) {
    await db.collection('seatClass').updateMany({},{$set:{seatNo:'1A:{"status":"B","isCorner":"True"}'}})
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
}
}
