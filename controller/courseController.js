let User = require("../model/studentModel");

const courseStudentController = async (req, res) => {
  res.send("Course student paisi");
  console.log("Course student paisi");
};

module.exports = { courseStudentController };
