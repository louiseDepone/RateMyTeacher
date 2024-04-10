// CREATE TABLE pinpost (
//     pinpost_id INT PRIMARY KEY auto_increment,
//     student_id INT,
//     rating_id INT,
//     FOREIGN KEY (student_id) REFERENCES students(student_id),
//     FOREIGN KEY (rating_id) REFERENCES ratings(rating_id)
// );

const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");


const pinpostController = {
    Get: {
        singlePinpost(req, res) {
        const { id } = req.params;
        const query = `SELECT * FROM pinpost WHERE pinpost_id = ? AND deleted = 0;`;
        db.query(query, [id], (err, result) => {
            if (err) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
            }
            if (result.length === 0) {
            return res.status(404).json({
                message: "Pinpost not found",
            });
            }
             return res.status(200).json(result);
        });
        },
        singleUserPinpost(req, res) {
        const { id } = req.params;
        const query = `
        SELECT * FROM pinpost WHERE student_id = ? `;
        db.query(query, [id], (err, result) => {
            if (err) {
             return res.status(500).json({
               message: "Internal Server Error",
               err,
             });
            }
            return res.status(200).json(result);
        });
        },
      
        multiplePinpost(req, res) {
        const query = `SELECT * FROM pinpost WHERE deleted = 0;`;
        db.query(query, (err, result) => {
            if (err) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
            }
            if (result.length === 0) {
            return res.status(404).json({
                message: "Pinpost not found",
            });
            }
             return res.status(200).json(result);
        });
        },
    },
    
    Put: {
        async singlePinpost(req, res) {
        const { id } = req.params;
        const { student_id, rating_id, deleted } = req.body;
        const query = `UPDATE pinpost SET student_id = ?, rating_id = ?, deleted = ? WHERE pinpost_id = ?;`;
        db.query(query, [student_id, rating_id, deleted, id], (err, result) => {
            if (err) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
            }
            return res.status(200).json({
              message: "Pinpost updated successfully",
            });
        });
        }
    },

    Post: {
        async singlePinpost(req, res) {
        const { student_id, rating_id } = req.body;
        const query = `INSERT INTO pinpost (student_id, rating_id) VALUES (?, ?);`;
        db.query(query, [student_id, rating_id], (err, result) => {
            if (err) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
            }
           return res.status(201).json({
             message: "Pinpost created successfully",
           });
        });
        },
    },

    Delete:{
        async singlePinpost(req, res) {
            const { rating_id, student_id } = req.params;
            const query = `DELETE FROM pinpost WHERE rating_id = ? AND student_id = ?;`;
            db.query(query, [rating_id, student_id], (err, result) => {
              if (err) {
                return res.status(500).json({
                  message: "Internal Server Error",
                });
              }
             return res.status(200).json({
               message: "Pinpost deleted successfully",
             });
            });
        }
    }

}
module.exports = pinpostController;
