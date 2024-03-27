const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");

const ratingController = require("../controllers/ratingController");

router.get("/ratings", authenticateToken, ratingController.Get.multipleRating);
router.get("/ratings/:id", authenticateToken, ratingController.Get.singleRating);

router.get(
  "/ratings/user/:id",
  authenticateToken,
  ratingController.Get.singleStudentRating
);

router.post("/ratings", authenticateToken, ratingController.Post.singleRating);
router.put("/ratings/:id", authenticateToken, ratingController.Put.singleRating);
router.delete("/ratings/:id", authenticateToken, ratingController.Delete.singleRating);

module.exports = router;