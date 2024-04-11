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
         
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        } else {
          if (result.length > 0) {
             return res.status(200).json(result[0]);
          } else {
            return res.status(404).json({ message: "Student Not Found" });
          }
        }
      });
    },
    multipleStudent(req, res) {
      const query = `SELECT * FROM students`;
      db.query(query, (err, result) => {
        if (err) {
         
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        } else {
          return res.status(200).json(result);
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
           
             return res.status(500).json({
            message: "Internal Server Error",
            err
          });
          } else {
            if (result.affectedRows > 0) {
             return res.status(200).json({ message: "Student Updated" });
            } else {
             return res.status(404).json({ message: "Student Not Found" });
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
      let continueRegister = false;
      let { name, email, password, student_id, role } = req.body;
    
      if (!name || !email || !password || !student_id) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);

         const querys = `SELECT * FROM students WHERE email = ? `;

         db.query(querys, [email], (err, result) => {
           if (err) {
             return res.status(500).json({
               message: "Internal Server Error",
               err,
             });
           } else {
             if (result.length > 0) {
               continueRegister = false;
               return res.status(409).json({ message: "Student Email Already in user" });
             } else {
                continueRegister = true;
             }
           }
         });

         const queryss = `SELECT * FROM students WHERE student_id = ? `;

         db.query(queryss, [student_id], (err, result) => {
           if (err) {
             return res.status(500).json({
               message: "Internal Server Error",
               err,
             });
           } else {
             if (result.length > 0) {
               continueRegister = false;
               return res
                 .status(409)
                 .json({ message: "Student ID Already in user" });
             } else {
                continueRegister = true;
             }
           }
         });

      if (continueRegister) { 
        console.log(continueRegister)
        const query = `INSERT INTO students (name, email, password, role, student_id) VALUES (?, ?, ?, ?, ?)`;
        if (!role) {
          role = "student";
        }
        db.query(
          query,
          [name, email, hashedPassword, role, student_id],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                message: "Internal Server Error",
                err,
              });
            } else {
              return res.status(201).json({ message: "Student Registered" });
            }
          }
        );
      } 
      return;
      
    },
//     registerStudent(req, res) {
//   let { name, email, password, student_id, role } = req.body;
//   let continueRegister = true;

//   if (!name || !email || !password || !student_id) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const hashedPassword = bcrypt.hashSync(password, 10);

//   const emailQuery = `SELECT * FROM students WHERE email = ?`;
//   const studentIdQuery = `SELECT * FROM students WHERE student_id = ?`;

//   const emailPromise = new Promise((resolve, reject) => {
//     db.query(emailQuery, [email], (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (result.length > 0) {
//           continueRegister = false;
//           resolve(false);
//         } else {
//           resolve(true);
//         }
//       }
//     });
//   });

//   const studentIdPromise = new Promise((resolve, reject) => {
//     db.query(studentIdQuery, [student_id], (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (result.length > 0) {
//           continueRegister = false;
//           resolve(false);
//         } else {
//           resolve(true);
//         }
//       }
//     });
//   });

//   Promise.all([emailPromise, studentIdPromise])
//     .then(([emailAvailable, studentIdAvailable]) => {
//       if (emailAvailable && studentIdAvailable) {
//         const query = `INSERT INTO students (name, email, password, role, student_id) VALUES (?, ?, ?, ?, ?)`;
//         if (!role) {
//           role = "student";
//         }
//         db.query(
//           query,
//           [name, email, hashedPassword, role, student_id],
//           (err, result) => {
//             if (err) {
//               return res.status(500).json({
//                 message: "Internal Server Error",
//                 err,
//               });
//             } else {
//               return res.status(201).json({ message: "Student Registered" });
//             }
//           }
//         );
//       } else {
//         return res.status(409).json({ message: "Email or Student ID already in use" });
//       }
//     })
//     .catch((err) => {
//       return res.status(500).json({
//         message: "Internal Server Error",
//         err,
//       });
//     });
// },
    async multipleStudent(req, res) {},
    async loginStudent(req, res) {
      const { email, password } = req.body;

      try {
        const query = `SELECT * FROM students WHERE email = ?`;
        db.query(query, [email], (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Internal Server Error",
              err,
            });
          } else {
            if (result.length === 0) {
              return res.status(401).json({ message: "Invalid Credentials" });
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
                return res
                  .status(200)
                  .json({ message: "Login Successful", token });
              } else {
                console.log("invaliedd!!!");
                return res.status(401).json({ message: "Invalid Credentials" });
              }
            } catch (error) {
              console.log("isPasswordCorrect");
              console.log(error);
              return res.status(401).json({ message: "Invalid Credentials" });
            }
          }
        });
      } catch (error) {
        console.log(error)
      }

      
    },
  },
  Delete: {
    async singleStudent(req, res) {

      const student_id = req.params.id;
      // this is a soft delete      const student_id = req.params.student_id;
      const query = `UPDATE students SET deleted = true WHERE student_id = ?`;
      db.query(query, [student_id], (err, result) => {
        if (err) {
         
           return res.status(500).json({
            message: "Internal Server Error",
            err
          });
        } else {
          if (result.affectedRows > 0) {
          return res.status(200).json({ message: "Student Deleted" });
          } else {
          return res.status(404).json({ message: "Student Not Found" });
          }
        }
      });
    },

    async multipleStudent(req, res) {},
  },
};

module.exports = studentController;
