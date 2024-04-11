const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");


// enrollments:

// enrollment_id (INT, Primary Key, Auto Increment)
// student_id (INT, Foreign Key referencing student_id in Students table)
// teacher_subject_id (INT, Foreign Key referencing teacher_subject_id in Teacher_Subjects table)
// deleted (BOOLEAN)

const enrollmentController = {
  Get: {
    singleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      const query = `SELECT * FROM enrollments WHERE enrollment_id = ? AND deleted = 0;`;
      db.query(query, [enrollment_id], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
        if (result.length === 0) {
          return res.status(404).json({
            message: "enrollment not found",
          });
        }
        return res.status(200).json(result);
      });
     },

    multipleEnrollment(req, res) {
      const query = `SELECT * FROM enrollments WHERE deleted = 0;`;
      db.query(query, (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
        if (result.length === 0) {
          return res.status(404).json({
            message: "enrollment not found",
          });
        }
          return res.status(200).json(result);
      });
    },

    multipleEnrollementDependingOnTheTeacherSubjectId(req, res) {
      const { id } = req.params;
      const query = `
SELECT 
  e.enrollment_id, 
  e.student_id, 
  e.teacher_subject_id, 
  e.deleted,
  t.name AS teacher_name,
  s.name AS student_name,
  sub.subject
FROM 
  enrollments e
JOIN 
  teacher_subjects ts ON e.teacher_subject_id = ts.teacher_subject_id
JOIN 
  teachers t ON ts.teacher_id = t.teacher_id
JOIN 
  students s ON e.student_id = s.student_id
JOIN 
  subjects sub ON ts.subject_id = sub.subject_id
WHERE 
  e.teacher_subject_id = ?;
	`;
      db.query(query, [id], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
        return res.status(200).json(result);
      });
    },
    multipleEnrollementDependingOnTheStudentId(req, res) {
      const { id } = req.params;
      const query = `
SELECT 
  e.enrollment_id, 
  e.student_id, 
  e.teacher_subject_id, 
  e.deleted,
  t.name AS teacher_name,
  s.name AS student_name,
  sub.subject
FROM 
  enrollments e
JOIN 
  teacher_subjects ts ON e.teacher_subject_id = ts.teacher_subject_id
JOIN 
  teachers t ON ts.teacher_id = t.teacher_id
JOIN 
  students s ON e.student_id = s.student_id
JOIN 
  subjects sub ON ts.subject_id = sub.subject_id
WHERE 
  e.student_id = ?  ; 
	`;
      db.query(query, [id], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
     return res.status(200).json(result);
      });
    }
  }, 

  Put: {
    async singleEnrollment(req, res) {
      const { enrollment_id } = req.params;

      const { student_id, teacher_subject_id, deleted } = req.body;
      if (!student || !teacher_subject_id || !deleted) {
        return res.status(400).json({
          message: "student id, teacher subject_id, deleted are required",
        });
      }

      const query = `UPDATE enrollments SET student_id = ?, teacher_subject_id = ?, deleted = ? WHERE enrollment_id = ?;`;
      db.query(query, [student_id, teacher_subject_id, deleted, enrollment_id], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
      return res.status(200).json(result);
      });
    },

    async multipleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      const { student_id, teacher_subject_id, deleted } = req.body;
      if (student_id === undefined || teacher_subject_id === undefined || deleted === undefined) {
        return res.status(400).json({
          message: "student_id, teacher_subject_id, deleted are required",  
        });
      }
      const query = `UPDATE enrollments SET student_id = ?, teacher_subject_id = ?, deleted = ? WHERE enrollment_id = ?;`;
      db.query(query, [student_id, teacher_subject_id, deleted, enrollment_id], (err, result) => {
        if (err) {
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        }
      return res.status(200).json(result);
      });
    },
  },

  Post: {
    async singleEnrollment(req, res) { 
      const { student_id, teacher_subject_id } = req.body;
      if (!student_id  || !teacher_subject_id) {
        return res.status(400).json({
          message: "student and complete course are required",
        });
      }
      console.log(req.body);
      db.query("INSERT INTO enrollments (student_id, teacher_subject_id) VALUES (?, ?)", [student_id, teacher_subject_id], (err, result) => {
        if (err) {
           return res.status(500).send(err);
        }
        return res.status(201).send(result);
      }
      );
    },

    async multipleEnrollmentToOneTeacherSubject(req, res) {
      const { student_id, teacher_subject_id } = req.body;
     if (!student_id || !teacher_subject_id) {
       return res.status(400).json({
         message: "student and complete course are required",
       });
     }
      try {
        
        for (let i = 0; i < student_id.length; i++) {
          console.log("adding") 
          try {
            db.query("INSERT INTO enrollments (student_id, teacher_subject_id) VALUES (?, ?)", [student_id[i], teacher_subject_id], (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }
            });
  
          } catch (error) { 
              console.log(error)
          }
        }
        
          console.log("finishe!!"); 
          res.status(201).send("success");
      } catch (error) { 
        console.log(error)
      }
    },
  }, 

  Delete: { 
    async singleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      db.query("UPDATE enrollments SET deleted = true WHERE enrollment_id = ?", [enrollment_id], (err, result) => {
        if (err) {
     return res.status(500).send(err); 
        }
      return res.status(200).send(result);
      });
    },

    async multipleEnrollment(req, res) {
      const { enrollment_id } = req.params;
      db.query("UPDATE enrollments SET deleted = true WHERE enrollment_id = ?", [enrollment_id], (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
      return res.status(200).send(result);
      });
    },
    async realDeletion(req, res) {
      const { id } = req.params;
      db.query("DELETE FROM enrollments WHERE enrollment_id = ?", [id], (err, result) => {
        if (err) {
       return res.status(500).send(err);
        }
        console.log(result)
        return res.status(200).send(result);
      });
    }
  },
};

module.exports = enrollmentController;