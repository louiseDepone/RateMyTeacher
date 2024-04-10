const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");
const e = require("express");

// subjects:

// subject_id (INT, Primary Key)
// subject (VARCHAR(50))
// deleted (BOOLEAN)

const subjectController = {
  Get: {
    singleSubject(req, res) {
      const id = req.params.id;
      db.query("SELECT * FROM subjects WHERE subject_id = ?", [subject_id], (err, result) => {
        if (err) {
         
          return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        } else {
          res.status(200).send(result);
        }
      });
    },

    multipleSubject(req, res) {
      db.query("SELECT * FROM subjects", (err, result) => {
        if (err) {
         
          return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
        res.status(200).send(result);
      }
      );
    },
    multipleSubjectOfACertainUser(req, res) {
      const id = req.params.id;
      db.query(
        `
      SELECT DISTINCT sub.subject_id,
sub.subject
FROM subjects sub
JOIN teacher_subjects ts ON sub.subject_id = ts.subject_id
JOIN enrollments e ON ts.teacher_subject_id = e.teacher_subject_id
JOIN students s ON e.student_id = s.student_id
WHERE s.student_id = ?
      `,
        [id],
        (err, result) => {
          if (err) {
           
          return res.status(500).json({
            message: "Internal Server Error",
            err
          });
          }
          res.status(200).send(result);
        }
      );
    },

    
  },

  Put: {
    async singleSubject(req, res) {
      const subject_id = req.params.subject_id;
      const { subject } = req.body;
      db.query("UPDATE subjects SET subject = ? WHERE subject_id = ?", [subject, subject_id], (err, result) => {
        if (err) {
         
          return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        } else {
          res.status(200).send(result);
        }
      });
    },

    async multipleSubject(req, res) {},
  },

  Post: {
    async singleSubject(req, res) {
      const { subject } = req.body;
      try {
        
        db.query("INSERT INTO subjects (subject) VALUES (?)", [subject], (err, result) => {
          if (err) {
           
          return res.status(500).json({
            message: "Internal Server Error",
            err
          });
          }
          res.status(201).send(result);
        }
        );
      } catch (error) {
        res.status(500).send(error);
      }
    },

    async multipleSubject(req, res) {},
  },

  Delete: {
    async singleSubject(req, res) {
      const subject_id = req.params.subject_id;
      db.query("UPDATE subjects SET deleted = true WHERE subject_id = ?", [subject_id], (err, result) => {
        if (err) {
         
          return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        } else {
          if (result.affectedRows > 0) {
            res.status(200).send(result);
          } else {
            res.status(404).send({ message: "Subject not found" });
          }
        }
      });
    },

    async multipleSubject(req, res) {},
  },
};

module.exports = subjectController;