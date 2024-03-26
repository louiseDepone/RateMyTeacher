const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");


const enrollmentController = require("../controllers/enrollmentController");

router.get(
  "/enrollment",
  authenticateToken,
  enrollmentController.Get.multipleEnrollment
);
router.post(
  "/enrollment",
  authenticateToken,
  enrollmentController.Post.singleEnrollment
);
router.get(
  "/enrollment/:id",
  authenticateToken,
  enrollmentController.Get.singleEnrollment
);
router.put(
  "/enrollment/:id",
  authenticateToken,
  enrollmentController.Put.singleEnrollment
);
router.delete(
  "/enrollment/:id",
  authenticateToken,
  enrollmentController.Delete.singleEnrollment
);

module.exports = router;