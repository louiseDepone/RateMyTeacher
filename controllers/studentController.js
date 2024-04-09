const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");

// Students:

// student_id (INT, Primary Key)
// name (VARCHAR(50))
// email (VARCHAR(100))
// password (VARCHAR(100))
// approved (BOOLEAN)
// deleted (BOOLEAN)
// role (VARCHAR(20), Default: 'student')
const studentController = {
  Get: {
    async verify(req, res) {
      const decoded = decoding(req);
      console.log(decoded);
      res.status(201).json(decoded);
    },

    singleStudent(req, res) {
      const student_id = req.params.student_id;
      const query = `SELECT * FROM students WHERE student_id = ?`;
      db.query(query, [student_id], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          if (result.length > 0) {
            res.status(200).json(result[0]);
          } else {
            res.status(404).json({ message: "Student Not Found" });
          }
        }
      });
    },
    multipleStudent(req, res) {
      const query = `SELECT * FROM students`;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          res.status(200).json(result);
        }
      });
    },
  },

  Put: {
    async singleStudent(req, res) {
      const student_id = req.params.student_id;
      const { name, email, password, role } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const query = `UPDATE students SET name = ?, email = ?, password = ?, role = ? WHERE student_id = ?`;
      db.query(
        query,
        [name, email, hashedPassword, role, student_id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Server Error" });
          } else {
            if (result.affectedRows > 0) {
              res.status(200).json({ message: "Student Updated" });
            } else {
              res.status(404).json({ message: "Student Not Found" });
            }
          }
        }
      );
    },

    async multipleStudent(req, res) {},
  },

  Post: {
    async singleStudent(req, res) {},
    registerStudent(req, res) {
      const role = "student";
      const { name, email, password, student_id } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const query = `INSERT INTO students (name, email, password, role, student_id) VALUES (?, ?, ?, ?, ?)`;
      db.query(
        query,
        [name, email, hashedPassword, role, student_id],
        (err, result) => {
          if (err) {
            console.log(err);
            res
              .status(401)
              .json({
                message:
                  err.code === "ER_DUP_ENTRY"
                    ? "Email Already Exists"
                    : "Server Error",
              });
          } else {
            res.status(201).json({ message: "Student Registered" });
          }
        }
      );
    },
    async multipleStudent(req, res) {},
    async loginStudent(req, res) {
      const { email, password } = req.body;
      const query = `SELECT * FROM students WHERE email = ?`;
      db.query(query, [email], (err, result) => {
        if (err) {
          res.status(500).json({ message: "Server Error" });
        } else {
          if (result.length === 0) {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
          }
          try {
            const isPasswordCorrect = bcrypt.compareSync(
              password,
              result[0]?.password
            );
            if (isPasswordCorrect) {
              const token = jsonwebtoken.sign(
                {
                  id: result[0].student_id,
                  role: result[0].role,
                  name: result[0].name,
                  email: result[0].email,
                },
                process.env.JWT_SECRET
              );
              console.log("Login Successful");
              res.status(200).json({ message: "Login Successful", token });
            } else {
              console.log("invaliedd!!!");
              res.status(401).json({ message: "Invalid Credentials" });
            }
          } catch (error) {
            console.log("isPasswordCorrect");
            console.log(error);
            res.status(401).json({ message: "Invalid Credentials" });
          }
        }
      });
    },
  },
  Delete: {
    async singleStudent(req, res) {
      // this is a soft delete      const student_id = req.params.student_id;
      const query = `UPDATE students SET deleted = true WHERE student_id = ?`;
      db.query(query, [student_id], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          if (result.affectedRows > 0) {
            res.status(200).json({ message: "Student Deleted" });
          } else {
            res.status(404).json({ message: "Student Not Found" });
          }
        }
      });
    },

    async multipleStudent(req, res) {},
  },
};

module.exports = studentController;
