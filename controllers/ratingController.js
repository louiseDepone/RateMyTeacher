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
// --   FOREIGN KEY (student_id) REFERENCES Students(student_id),
// --   FOREIGN KEY (teacher_subject_id) REFERENCES Teacher_Subjects(teacher_subject_id)
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
            res
              .status(500)
              .json({ error: "An error occurred while fetching the rating" });
          } else {
            if (result.length === 0) {
              res.status(404).json({ error: "Rating not found" });
            } else {
              res.status(200).json(result[0]);
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
  Students.name AS studentName,
  Teachers.name AS teacherName,
  Subjects.subject AS subjectName,
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
  INNER JOIN Students ON ratings.student_id = Students.student_id
  INNER JOIN Teacher_Subjects ON ratings.teacher_subject_id = Teacher_Subjects.teacher_subject_id
  INNER JOIN Teachers ON Teacher_Subjects.teacher_id = Teachers.teacher_id
  INNER JOIN Subjects ON Teacher_Subjects.subject_id = Subjects.subject_id
WHERE
  Students.student_id = ?
  
  order by ratings.rating_id desc`;
        db.query(query, [id], (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "An error occurred while fetching the rating" });
          } else {
            res.status(200).json(result);
          }
        }
      );
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
        Students.name AS studentName,
        Teachers.name AS teacherName,
        Subjects.subject AS subjectName,
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
        INNER JOIN Students ON ratings.student_id = Students.student_id
        INNER JOIN Teacher_Subjects ON ratings.teacher_subject_id = Teacher_Subjects.teacher_subject_id
        INNER JOIN Teachers ON Teacher_Subjects.teacher_id = Teachers.teacher_id
        INNER JOIN Subjects ON Teacher_Subjects.subject_id = Subjects.subject_id
        
      Where ratings.deleted = 0 AND ratings.approved = 1
        order by ratings.rating_id desc
        ;`,
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "An error occurred while fetching the ratings" });
          } else {
            console.log(result);
            res.status(200).json(result);
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
            res
              .status(500)
              .json({ error: "An error occurred while updating the rating" });
          } else {
            res.status(200).json(result);
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

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
      console.log(
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
        date
      );
      console.log("ssafasf");
      db.query(
        "INSERT INTO ratings (student_id, teacher_subject_id, teaching_method, attitude, communication, organization, supportiveness, engagement, likes, dislikes, comment,date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?)",
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
          date
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "An error occurred while creating the rating" });
          } else {
            res.status(201).json(result);
          }
        }
      );
    },

    async multipleRating(req, res) {},
  },

  Delete: {
    async singleRating(req, res) {
      const ratingId = req.params.id;
      const { deleted } = req.body;
      console.log(deleted, ratingId);
      db.query(
        "UPDATE ratings SET deleted = ? WHERE rating_id = ?",
        [deleted,ratingId],
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "An error occurred while deleting the rating" });
          } else {
            if (result.affectedRows > 0) {
                            console.log(result);
              res.status(200).json(result);
            } else {
              console.log(result);
              res.status(404).json({ error: "Rating not found" });
            }
          }
        }
      );
    },

    async multipleRating(req, res) {},
  },
};

module.exports = ratingController;
