const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");


// Enrollments:

// enrollment_id (INT, Primary Key, Auto Increment)
// student_id (INT, Foreign Key referencing student_id in Students table)
// teacher_subject_id (INT, Foreign Key referencing teacher_subject_id in Teacher_Subjects table)
// deleted (BOOLEAN)

const enrollmentController = {
  Get: {
    singleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      const query = `SELECT * FROM Enrollments WHERE enrollment_id = ? AND deleted = 0;`;
      db.query(query, [enrollment_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.length === 0) {
          return res.status(404).json({
            message: "Enrollment not found",
          });
        }
        res.status(200).json(result);
      });
     },

    multipleEnrollment(req, res) {
      const query = `SELECT * FROM Enrollments WHERE deleted = 0;`;
      db.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.length === 0) {
          return res.status(404).json({
            message: "Enrollment not found",
          });
        }
        res.status(200).json(result);
      });
    },
  },

  Put: {
    async singleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      const { student_id, teacher_subject_id, deleted } = req.body;
      const query = `UPDATE Enrollments SET student_id = ?, teacher_subject_id = ?, deleted = ? WHERE enrollment_id = ?;`;
      db.query(query, [student_id, teacher_subject_id, deleted, enrollment_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(200).json(result);
      });
    },

    async multipleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      const { student_id, teacher_subject_id, deleted } = req.body;
      const query = `UPDATE Enrollments SET student_id = ?, teacher_subject_id = ?, deleted = ? WHERE enrollment_id = ?;`;
      db.query(query, [student_id, teacher_subject_id, deleted, enrollment_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(200).json(result);
      });
    },
  },

  Post: {
    async singleEnrollment(req, res) {
      const { student_id, teacher_subject_id } = req.body;
      db.query("INSERT INTO Enrollments (student_id, teacher_subject_id) VALUES (?, ?)", [student_id, teacher_subject_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(201).send(result);
      }
      );
    },

    async multipleEnrollment(req, res) {
      const { student_id, teacher_subject_id } = req.body;
      db.query("INSERT INTO Enrollments (student_id, teacher_subject_id) VALUES (?, ?)", [student_id, teacher_subject_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(201).send(result);
      }
      );
    },
  },

  Delete: {
    async singleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      db.query("UPDATE Enrollments SET deleted = true WHERE enrollment_id = ?", [enrollment_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      });
    },

    async multipleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      db.query("UPDATE Enrollments SET deleted = true WHERE enrollment_id = ?", [enrollment_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      });
    },
  },
};

module.exports = enrollmentController;