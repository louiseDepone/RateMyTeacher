const mysql2 = require("mysql2");

const db = mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

var poolCluster = mysql2.createPool(db);

var queryDB = function (query, cb) {
  poolCluster.getConnection(function (err, connection) {
    if (err) {
      cb(err, null);
    } else {
      connection.query(query, function (err, rows) {
        connection.release();
        cb(err, rows);
      });
    }
  }); 
};
module.exports = { db };
