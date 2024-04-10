const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");


// Teachers:

// teacher_id (INT, Primary Key)
// name (VARCHAR(50))
// email (VARCHAR(100))
// deleted (BOOLEAN)

const teacherContoller = {
  Get: {
    singleTeacher(req, res) {
      const teacher_id = req.params.teacher_id;
      db.query("SELECT * FROM teachers WHERE teacher_id = ?", [teacher_id], (err, result) => {
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
    mutliplesTeacherOfACertainUser(req, res) {
      const id = req.params.id;
      db.query(
        `SELECT t.teacher_id, t.name AS teacher_name, COUNT(DISTINCT t.teacher_id) AS teacher_count
FROM teachers t
JOIN teacher_subjects ts ON t.teacher_id = ts.teacher_id
JOIN enrollments e ON ts.teacher_subject_id = e.teacher_subject_id
JOIN students s ON e.student_id = s.student_id
WHERE s.student_id = ?
GROUP BY t.teacher_id, t.name;`,
        [id],
        (err, result) => {
          if (err) {
            
          return res.status(500).json({
            message: "Internal Server Error",
            err
          });
          } else {
            res.status(200).send(result);
          }
        }
      );
    },

    multipleTeacher(req, res) {
      db.query("SELECT * FROM teachers", (err, result) => {
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
    async singleTeacher(req, res) {
      const teacher_id = req.params.teacher_id;
      const { name, email } = req.body;
      db.query("UPDATE teachers SET name = ?, email = ? WHERE teacher_id = ?", [name, email, teacher_id], (err, result) => {
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

    async multipleTeacher(req, res) {
      const teacher_id = req.params.teacher_id;
      const { name, email } = req.body;
      db.query("UPDATE teachers SET name = ?, email = ? WHERE teacher_id = ?", [name, email, teacher_id], (err, result) => {
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
  },

  Post: {
    async singleTeacher(req, res) {
      const { name, email } = req.body;
      try {
        
        db.query("INSERT INTO teachers (name, email) VALUES (?, ?)", [name, email], (err, result) => {
          if (err) {
            
          return res.status(500).json({
            message: "Internal Server Error",
            err
          });
          } else {
            res.status(201).send(result);
          }
        });
      } catch (error) {
        console.log(error)
      }
    },

    async multipleTeacher(req, res) {},
  },

  Delete: {
    async singleTeacher(req, res) {
      const teacher_id = req.params.teacher_id;
      db.query("UPDATE teachers SET deleted = true WHERE teacher_id = ?", [teacher_id], (err, result) => {
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

    async multipleTeacher(req, res) {},
  },
};
 
module.exports = teacherContoller;