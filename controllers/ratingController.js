const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");
 
// ratings:
// -- CREATE TABLE ratings (
// --   rating_id INT PRIMARY KEY AUTO_INCREMENT,
// --   student_id INT,
// --   teacher_subject_id INT,
// --   rating_value INT,
// --   comment TEXT,
// --   date DATE,
// --   approved BOOLEAN DEFAULT FALSE,
// --   deleted BOOLEAN DEFAULT FALSE,
// --   FOREIGN KEY (student_id) REFERENCES students(student_id),
// --   FOREIGN KEY (teacher_subject_id) REFERENCES teacher_subjects(teacher_subject_id)
// -- );
// -- ALTER TABLE ratings
// -- DROP COLUMN rating_value,
// -- ADD COLUMN teaching_method INT,
// -- ADD COLUMN attitude INT,
// -- ADD COLUMN communication INT,
// -- ADD COLUMN organization INT,
// -- ADD COLUMN supportiveness INT,
// -- ADD COLUMN engagement INT;
// -- ALTER TABLE ratings
// -- ADD COLUMN likes INT DEFAULT 0,
// -- ADD COLUMN dislikes INT DEFAULT 0;

const ratingController = {
  Get: {
    singleRating(req, res) {
      const ratingId = req.params.ratingId;
      db.query(
        "SELECT * FROM ratings WHERE rating_id = ?",
        [ratingId],
        (err, result) => {
          if (err) {
            console.error(err);
             return res
               .status(500)
               .json({ error: "An error occurred while fetching the rating" });
          } else {
            if (result.length === 0) {
               return res.status(404).json({ error: "Rating not found" });
            } else {
              return res.status(200).json(result[0]);
            }
          }
        }
      );
    },
    singleStudentRating(req, res) {
      const { id } = req.params;
      const query = `
        SELECT
  ratings.rating_id,
  students.name AS studentName,
  teachers.name AS teacherName,
  subjects.subject AS subjectName,
  ratings.comment,
  ratings.teaching_method,
  ratings.attitude,
  ratings.communication,
  ratings.organization,
  ratings.supportiveness,
  ratings.engagement,
  ratings.likes,
  ratings.date,
        ratings.approved,
        ratings.deleted
FROM
  ratings
  INNER JOIN students ON ratings.student_id = students.student_id
  INNER JOIN teacher_subjects ON ratings.teacher_subject_id = teacher_subjects.teacher_subject_id
  INNER JOIN teachers ON teacher_subjects.teacher_id = teachers.teacher_id
  INNER JOIN subjects ON teacher_subjects.subject_id = subjects.subject_id
WHERE
  students.student_id = ?
  
  order by ratings.rating_id desc`;
      db.query(query, [id], (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "An error occurred while fetching the rating" });
        } else {
          return res.status(200).json(result);
        }
      });
    },

    // multipleRating(req, res) {
    //   db.query("SELECT * FROM ratings", (err, result) => {
    //     if (err) {
    //       console.error(err);
    //       res.status(500).json({ error: "An error occurred while fetching the ratings" });
    //     } else {
    //       res.status(200).json(result);
    //     }
    //   });
    // }
    multipleRating(req, res) {
      db.query(
        `SELECT
        ratings.rating_id,
        ratings.student_id,
        students.name AS studentName,
        teachers.name AS teacherName,
        teachers.teacher_id,
        subjects.subject AS subjectName,
        subjects.subject_id ,
        ratings.comment,
        ratings.teaching_method,
        ratings.attitude,
        ratings.communication,
        ratings.organization,
        ratings.supportiveness,
        ratings.engagement,
        ratings.likes,
        ratings.dislikes,
        ratings.date,
        ratings.approved,
        ratings.deleted
        

      FROM
        ratings
        INNER JOIN students ON ratings.student_id = students.student_id
        INNER JOIN teacher_subjects ON ratings.teacher_subject_id = teacher_subjects.teacher_subject_id
        INNER JOIN teachers ON teacher_subjects.teacher_id = teachers.teacher_id
        INNER JOIN subjects ON teacher_subjects.subject_id = subjects.subject_id
        order by ratings.rating_id desc
        ;`,
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "An error occurred while fetching the ratings" });
          } else {
            console.log(result);
            return res.status(200).json(result);
          }
        }
      );
    },
  },

  Put: {
    async singleRating(req, res) {
      const ratingId = req.params.ratingId;
      const {
        teaching_method,
        attitude,
        communication,
        organization,
        supportiveness,
        engagement,
        likes,
        dislikes,
        comment,
      } = req.body;
      if (
        !teaching_method ||
        !attitude ||
        !communication ||
        !organization ||
        !supportiveness ||
        !engagement ||
        !likes ||
        !dislikes 
      ) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }
      db.query(
        "UPDATE ratings SET teaching_method = ?, attitude = ?, communication = ?, organization = ?, supportiveness = ?, engagement = ?, likes = ?, dislikes = ?  , comment = ?WHERE rating_id = ?",
        [
          teaching_method,
          attitude,
          communication,
          organization,
          supportiveness,
          engagement,
          likes,
          dislikes,
          comment,
          ratingId,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
             return res
               .status(500)
               .json({ error: "An error occurred while updating the rating" });
          } else {
             return res.status(200).json(result);
          }
        }
      );
    },

    async multipleRating(req, res) {},
  },

  Post: {
    async singleRating(req, res) {
      const {
        student_id,
        teacher_subject_id,
        teaching_method,
        attitude,
        communication,
        organization,
        supportiveness,
        engagement,
        likes,
        dislikes,
        comment,
      } = req.body.data;
      if(
        !student_id ||
        !teacher_subject_id ||
        !teaching_method ||
        !attitude ||
        !communication ||
        !organization ||
        !supportiveness ||
        !engagement ||
        !likes ||
        !dislikes ||
        !comment
      ){
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];
      console.log("ssafasf");
      db.query(
        "INSERT INTO ratings (student_id, teacher_subject_id, teaching_method, attitude, communication, organization, supportiveness, engagement, likes, dislikes, comment,date, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)",
        [
          student_id,
          teacher_subject_id,
          teaching_method,
          attitude,
          communication,
          organization,
          supportiveness,
          engagement,
          likes,
          dislikes,
          comment,
          date,
          0,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
           return res
             .status(500)
             .json({ error: "An error occurred while creating the rating" });
          } else {
            return res.status(201).json(result);
          }
        }
      );
    },

    async multipleRating(req, res) {},
  },

  Delete: {
    async singleRating(req, res) {
      const id = req.params.id;
      const { deleted } = req.body;
      db.query(
        "UPDATE ratings SET deleted = ? WHERE rating_id = ?",
        [deleted, id],
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "An error occurred while deleting the rating" });
          } else {
            if (result.affectedRows > 0) {
              // res.status(200).json(result);
                    db.query(
                      "DELETE FROM pinpost WHERE rating_id = ? ",
                      [id],
                      (err, result) => {
                        if (err) {
                          console.error(err);
                         return res.status(500).json({
                           error: "An error occurred while deleting the rating",
                         });
                        } else {
                          if (result.affectedRows > 0) {
                          return res.status(200).json(result);
                          } 
                        }
                      }
                    );


            } else {
              console.log(result);
             return res.status(404).json({ error: "Rating not found" });
            }
          }
        }
      );
    },

    async approveDisapproveraiting(req, res) {
      const id = req.params.id;
      const { approved } = req.body;
      console.log(req.body)
      db.query(
        "UPDATE ratings SET approved = ? WHERE rating_id = ?",
        [approved, id],
        (err, result) => {
          if (err) {
            console.error(err);
          return res
            .status(500)
            .json({ error: "An error occurred while deleting the rating" });
          } else {
            if (result.affectedRows > 0) {
              // res.status(200).json(result);
              if(approved === 0){
                db.query(
                  "DELETE FROM pinpost WHERE rating_id = ? ",
                  [id],
                  (err, result) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({
                        error: "An error occurred while deleting the rating",
                      });
                    } else {
                      
                    }
                  }
                );
              }
            } else {
              console.log(result);
              return res.status(404).json({ error: "Rating not found" });
            }
          }
           return res.status(200).json({ message: "Rating approved" });
        }
      );
    }
  },
};

module.exports = ratingController;
