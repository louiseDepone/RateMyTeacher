const mysql2 = require("mysql2");

// const db = mysql2.createConnection({
//   connectionLimit: 10,
//   acquireTimeout: 30000,
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   port:  process.env.PORT,

// });

// var db = mysql2.createPool({
//   // connectionLimit: 10,
//   //   acquireTimeout: 30000,
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     port:  process.env.PORT,
// });

// var queryDB = function (query, cb) {
//   poolCluster.getConnection(function (err, connection) {
//     if (err) {
//       cb(err, null);
//     } else {
//       connection.query(query, function (err, rows) {
//         connection.release();
//         cb(err, rows);
//       });
//     }
//   }); 
// };



var db = mysql2.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port:  process.env.PORT,
});

db.connect(function (err) {
  if (err){
    
    console.log(err)
    throw err};
  console.log("Connected!");
});
module.exports = { db };
