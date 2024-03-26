const bcrypt = require("bcrypt");
const { db } = require("../configs/database");
const { jsonwebtoken } = require("../middlewares/authMiddleware");
const { decoding } = require("../services/jwt");

// Ratings:
// -- CREATE TABLE Ratings (
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
// -- ALTER TABLE Ratings
// -- DROP COLUMN rating_value,
// -- ADD COLUMN teaching_method INT,
// -- ADD COLUMN attitude INT,
// -- ADD COLUMN communication INT,
// -- ADD COLUMN organization INT,
// -- ADD COLUMN supportiveness INT,
// -- ADD COLUMN engagement INT;
// -- ALTER TABLE Ratings
// -- ADD COLUMN likes INT DEFAULT 0,
// -- ADD COLUMN dislikes INT DEFAULT 0;


const ratingController = {
  Get: {
    singleRating(req, res) {
      const ratingId = req.params.ratingId;
      db.query("SELECT * FROM Ratings WHERE rating_id = ?", [ratingId], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "An error occurred while fetching the rating" });
        } else {
          if (result.length === 0) {
            res.status(404).json({ error: "Rating not found" });
          } else {
            res.status(200).json(result[0]);
          }
        }
      });
    },

    // multipleRating(req, res) {
    //   db.query("SELECT * FROM Ratings", (err, result) => {
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
        Ratings.rating_id,
        Students.name AS studentName,
        Teachers.name AS teacherName,
        Subjects.subject AS subjectName,
        Ratings.comment,
        Ratings.teaching_method,
        Ratings.attitude,
        Ratings.communication,
        Ratings.organization,
        Ratings.supportiveness,
        Ratings.engagement,
        Ratings.likes,
        Ratings.dislikes
      FROM
        Ratings
        INNER JOIN Students ON Ratings.student_id = Students.student_id
        INNER JOIN Teacher_Subjects ON Ratings.teacher_subject_id = Teacher_Subjects.teacher_subject_id
        INNER JOIN Teachers ON Teacher_Subjects.teacher_id = Teachers.teacher_id
        INNER JOIN Subjects ON Teacher_Subjects.subject_id = Subjects.subject_id;`,
        (err, result) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: "An error occurred while fetching the ratings" });
          } else {
            res.status(200).json(result);
          }
        }
      );
    }
  },

  Put: {
    async singleRating(req, res) {
      const ratingId = req.params.ratingId;
      const { teaching_method, attitude, communication, organization, supportiveness, engagement, likes, dislikes } = req.body;
      db.query("UPDATE Ratings SET teaching_method = ?, attitude = ?, communication = ?, organization = ?, supportiveness = ?, engagement = ?, likes = ?, dislikes = ? WHERE rating_id = ?", [teaching_method, attitude, communication, organization, supportiveness, engagement, likes, dislikes, ratingId], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "An error occurred while updating the rating" });
        } else {
          res.status(200).json(result);
        }
      });
    },

    async multipleRating(req, res) {

    },
  },

  Post: {
    async singleRating(req, res) {
      const { student_id, teacher_subject_id, teaching_method, attitude, communication, organization, supportiveness, engagement, likes, dislikes } = req.body;
      db.query("INSERT INTO Ratings (student_id, teacher_subject_id, teaching_method, attitude, communication, organization, supportiveness, engagement, likes, dislikes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [student_id, teacher_subject_id, teaching_method, attitude, communication, organization, supportiveness, engagement, likes, dislikes], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "An error occurred while creating the rating" });
        } else {
          res.status(201).json(result);
        }
      });
    },

    async multipleRating(req, res) {},
  },

  Delete: {
    async singleRating(req, res) {
      const ratingId = req.params.ratingId;
      db.query("UPDATE Ratings SET deleted = true WHERE rating_id = ?", [ratingId], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "An error occurred while deleting the rating" });
        } else {
          if (result.affectedRows > 0) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ error: "Rating not found" });
          }
        }
      });
    },

    async multipleRating(req, res) {},
  },
};

module.exports = ratingController;