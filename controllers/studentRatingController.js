const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");
   
// Student_Ratings:f

// rating_id (INT, Primary Key, Auto Increment)
// student_id (INT, Foreign Key referencing student_id in Students table)
// rating_value (INT)
// comment (TEXT)
// date (DATE)
// approved (BOOLEAN)
// deleted (BOOLEAN)

const studentRatingController = {
  Get: {
    singleStudentRating(req, res) {
      const { rating_id } = req.params;
      const query = `SELECT * FROM Student_Ratings WHERE rating_id = ? AND deleted = 0;`;
      db.query(query, [rating_id], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
        if (result.length === 0) {
          return res.status(404).json({
            message: "Student_Rating not found",
          });
        }
       return res.status(200).json(result);
      });
    },

    multipleStudentRating(req, res) {
      const query = `SELECT * FROM Student_Ratings WHERE deleted = 0;`;
      db.query(query, (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
        if (result.length === 0) {
          return res.status(404).json({
            message: "Student_Rating not found",
          });
        }
      return res.status(200).json(result);
      });
    },
  },

  Put: {
    async singleStudentRating(req, res) {
      const { rating_id } = req.params;
      const { student_id, rating_value, comment, date, approved, deleted } = req.body;
      const query = `UPDATE Student_Ratings SET student_id = ?, rating_value = ?, comment = ?, date = ?, approved = ?, deleted = ? WHERE rating_id = ?;`;
      db.query(query, [student_id, rating_value, comment, date, approved, deleted, rating_id], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
       return res.status(200).json(result);
      });
    },

    async multipleStudentRating(req, res) {},
  },

  Post: {
    async singleStudentRating(req, res) {
      const { student_id, rating_value, comment, date, approved, deleted } = req.body;
      const query = `INSERT INTO Student_Ratings (student_id, rating_value, comment, date, approved, deleted) VALUES (?, ?, ?, ?, ?, ?);`;
      db.query(query, [student_id, rating_value, comment, date, approved, deleted], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
       return res.status(201).json(result);
      });
    },

    async multipleStudentRating(req, res) {},
  },
  Delete: {
    async singleStudentRating(req, res) {
      const { rating_id } = req.params;
      const query = `UPDATE Student_Ratings SET deleted = true WHERE rating_id = ?;`;
      db.query(query, [rating_id], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
       return res.status(200).json(result);
      });
    },

    async multipleStudentRating(req, res) {},
  },
};

module.exports = studentRatingController;