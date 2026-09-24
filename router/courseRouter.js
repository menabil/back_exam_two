const express = require("express");
const { courseStudentController } = require("../controller/courseController");
const router = express();

router.post("/registration", courseStudentController);

module.exports = router;
