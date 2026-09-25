const express = require("express");
const {
  registrationCourseController,
  allCourseController,
  singleCourseController,
  updateSingleCourseController,
  deleteSingleCourseController,
  getCourseAtStudents,
} = require("../controller/courseController");
const router = express();

router.post("/registration", registrationCourseController);
router.get("/all/course", allCourseController);
router.get("/:id", singleCourseController);
router.patch("/update/:id", updateSingleCourseController);
router.delete("/delete/:id", deleteSingleCourseController);
router.post("/:courseId/enroll/:studentId", getCourseAtStudents);

module.exports = router;
