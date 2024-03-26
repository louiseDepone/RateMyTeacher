const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const studentRatingController = require("../controllers/studentRatingController");

router.get("/student-ratings", authenticateToken, studentRatingController.Get.multipleStudentRating);
router.get("/student-ratings/:id", authenticateToken, studentRatingController.Get.singleStudentRating);
router.post("/student-ratings", authenticateToken, studentRatingController.Post.singleStudentRating);
router.put("/student-ratings/:id", authenticateToken, studentRatingController.Put.singleStudentRating);
router.delete("/student-ratings/:id", authenticateToken, studentRatingController.Delete.singleStudentRating);


module.exports = router;