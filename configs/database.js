const mysql2 = require("mysql2");

const db = mysql2.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

db.connect((err) => {
    if(err){
        console.error("Error MySQL connection", err);
    }else{
        console.log("MySQL connected successfully")
    }
})

module.exports = {db}
