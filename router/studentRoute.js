const express = require("express");
const {
  registrationStudentController,
  allStudentController,
  singleStudentController,
  updateSingleStudentController,
  deleteSingleStudentController,
  enrollStudentController,
} = require("../controller/studentController");
const router = express.Router();

router.post("/registration", registrationStudentController);
router.get("/all/student", allStudentController);
router.get("/:id", singleStudentController);
router.patch("/update/:id", updateSingleStudentController);
router.delete("/delete/:id", deleteSingleStudentController);
router.post("/:studentId/enroll/:courseId", enrollStudentController);

module.exports = router;
