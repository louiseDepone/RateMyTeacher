const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");

// Teacher_Subjects:

// teacher_subject_id (INT, Primary Key, Auto Increment)
// teacher_id (INT, Foreign Key referencing teacher_id in Teachers table)
// subject_id (INT, Foreign Key referencing subject_id in Subjects table)

const teacherSubjectController = {
  Get: {
    singleTeacherSubject(req, res) {
      const { id } = req.params;
      const query = `SELECT * FROM Teacher_Subjects WHERE teacher_subject_id = ? AND deleted = 0;`;
      db.query(query, [id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.length === 0) {
          return res.status(404).json({
            message: "Teacher_Subject not found",
          });
        }
        res.status(200).json(result);
      });
    },
    singleUserTeacherSubject(req, res) {
      const { id } = req.params;
      console.log(id);
      const query = `
   SELECT 
   Enrollments.deleted,
  Enrollments.enrollment_id,
  Enrollments.student_id,
  Enrollments.teacher_subject_id,
  Teachers.name AS teacher,
  Subjects.subject AS subject
FROM
  Enrollments
  INNER JOIN Students ON Enrollments.student_id = Students.student_id
  INNER JOIN Teacher_Subjects ON Enrollments.teacher_subject_id = Teacher_Subjects.teacher_subject_id
  INNER JOIN Teachers ON Teacher_Subjects.teacher_id = Teachers.teacher_id
  INNER JOIN Subjects ON Teacher_Subjects.subject_id = Subjects.subject_id
WHERE
  Enrollments.deleted = 0 AND Students.student_id = ?`;
      db.query(query, [id], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(200).json(result);}

      );
    },

    multipleTeacherSubject(req, res) {
      const query = `SELECT * FROM Teacher_Subjects WHERE deleted = 0;`;
      db.query(query, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.length === 0) {
          return res.status(404).json({
            message: "Teacher_Subject not found",
          });
        }
        res.status(200).json(result);
      });
    },
  },

  Put: {
    async singleTeacherSubject(req, res) {
      const { teacher_subject_id } = req.params;
      const { teacher_id, subject_id } = req.body;
      const query = `UPDATE Teacher_Subjects SET teacher_id = ?, subject_id = ? WHERE teacher_subject_id = ? AND deleted = 0;`;
      db.query(
        query,
        [teacher_id, subject_id, teacher_subject_id],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Internal Server Error",
            });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Teacher_Subject not found",
            });
          }
          res.status(200).json({
            message: "Teacher_Subject updated successfully",
          });
        }
      );
    },

    async multipleTeacherSubject(req, res) {
      const { teacher_subject_id } = req.params;
      const { teacher_id, subject_id } = req.body;
      const query = `UPDATE Teacher_Subjects SET teacher_id = ?, subject_id = ? WHERE deleted = 0;`;
      db.query(
        query,
        [teacher_id, subject_id, teacher_subject_id],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Internal Server Error",
            });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Teacher_Subject not found",
            });
          }
          res.status(200).json({
            message: "Teacher_Subject updated successfully",
          });
        }
      );
    },
  },

  Post: {
    async singleTeacherSubject(req, res) {
      const { teacher_id, subject_id } = req.body;
      const query = `INSERT INTO Teacher_Subjects (teacher_id, subject_id) VALUES (?, ?);`;
      db.query(query, [teacher_id, subject_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(201).json({
          message: "Teacher_Subject created successfully",
        });
      });
    },

    async multipleTeacherSubject(req, res) {
      const { teacher_id, subject_id } = req.body;
      const query = `INSERT INTO Teacher_Subjects (teacher_id, subject_id) VALUES (?, ?);`;
      db.query(query, [teacher_id, subject_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(201).json({
          message: "Teacher_Subject created successfully",
        });
      });
    },
  },
  Delete: {
    async singleTeacherSubject(req, res) {
      const { teacher_subject_id } = req.params;
      const query = `UPDATE Teacher_Subjects SET deleted = 1 WHERE teacher_subject_id = ?;`;
      db.query(query, [teacher_subject_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Teacher_Subject not found",
          });
        }
        res.status(200).json({
          message: "Teacher_Subject deleted successfully",
        });
      });
    },

    async multipleTeacherSubject(req, res) {},
  },
};

module.exports = teacherSubjectController;
