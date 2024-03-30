const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");

// teacher_subjects:

// teacher_subject_id (INT, Primary Key, Auto Increment)
// teacher_id (INT, Foreign Key referencing teacher_id in Teachers table)
// subject_id (INT, Foreign Key referencing subject_id in subjects table)

const teacherSubjectController = {
  Get: {
    singleTeacherSubject(req, res) {
      const { id } = req.params;
      const query = `SELECT * FROM teacher_subjects WHERE teacher_subject_id = ? AND deleted = 0;`;
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
   enrollments.deleted,
  enrollments.enrollment_id,
  enrollments.student_id,
  enrollments.teacher_subject_id,
  teachers.name AS teacher,
  subjects.subject AS subject
FROM
  enrollments
  INNER JOIN students ON enrollments.student_id = students.student_id
  INNER JOIN teacher_subjects ON enrollments.teacher_subject_id = teacher_subjects.teacher_subject_id
  INNER JOIN teachers ON teacher_subjects.teacher_id = teachers.teacher_id
  INNER JOIN subjects ON teacher_subjects.subject_id = subjects.subject_id
WHERE
  enrollments.deleted = 0 AND students.student_id = ?`;
      db.query(query, [id], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(200).json(result);
      });
    },

    multipleTeacherSubject(req, res) {
      const query = `
SELECT ts.teacher_subject_id, 
t.name AS teacher_name, 
s.subject as subject,
t.teacher_id AS teacher_id, 
s.subject_id as subject_id
FROM teacher_subjects ts
JOIN teachers t ON ts.teacher_id = t.teacher_id
JOIN subjects s ON ts.subject_id = s.subject_id`;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }
        res.status(200).json(result);
      });
    },
    emrolledsubjects(req, res) {
      console.log("YOU HSOULD ENTER HERE!")
            const query = `SELECT
         enrollments.deleted,
        enrollments.enrollment_id,
        enrollments.student_id,
        enrollments.teacher_subject_id,
        teachers.name AS teacher,
        students.name as student,
        subjects.subject AS subject,
        teachers.teacher_id AS teacher_id,
        subjects.subject_id AS subject_id
      FROM
        enrollments
        INNER JOIN students ON enrollments.student_id = students.student_id
        INNER JOIN teacher_subjects ON enrollments.teacher_subject_id = teacher_subjects.teacher_subject_id
        INNER JOIN teachers ON teacher_subjects.teacher_id = teachers.teacher_id
        INNER JOIN subjects ON teacher_subjects.subject_id = subjects.subject_id`;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Internal Server Error",
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
      const query = `UPDATE teacher_subjects SET teacher_id = ?, subject_id = ? WHERE teacher_subject_id = ? AND deleted = 0;`;
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
      const query = `UPDATE teacher_subjects SET teacher_id = ?, subject_id = ? WHERE deleted = 0;`;
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
      const query = `INSERT INTO teacher_subjects (teacher_id, subject_id) VALUES (?, ?);`;
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
      const query = `INSERT INTO teacher_subjects (teacher_id, subject_id) VALUES (?, ?);`;
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
      const query = `UPDATE teacher_subjects SET deleted = 1 WHERE teacher_subject_id = ?;`;
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
