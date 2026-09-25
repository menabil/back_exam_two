const mongoose = require("mongoose");
const Student = require("../model/studentModel");
const Course = require("../model/courseModel");

const registrationStudentController = async (req, res) => {
  try {
    let { name, email, phone, age, enrolledCourses } = req.body;

    if (!name || !email || !phone || !age) {
      return res
        .status(400)
        .json({ success: false, message: "Please give all information" });
    }
    if (age < 18) {
      return res
        .status(400)
        .json({ success: false, message: "Age must be 18 or above" });
    }

    let exUser = await Student.findOne({ email: email });
    if (exUser) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists",
      });
    }

    let newUser = await Student.create({
      name,
      email,
      phone,
      age,
      enrolledCourses,
    });
    return res
      .status(201)
      .json({ success: true, message: "Student created", data: newUser });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const allStudentController = async (req, res) => {
  try {
    let allStudent = await Student.find({});
    return res.status(200).json({
      success: true,
      message: `Total student: ${allStudent.length}`,
      data: allStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const singleStudentController = async (req, res) => {
  try {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student id" });
    }

    let exUser = await Student.findById(id).populate("enrolledCourses");
    if (!exUser) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Student details", data: exUser });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const updateSingleStudentController = async (req, res) => {
  try {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student id" });
    }

    if (req.body.email) {
      let exStudent = await Student.findOne({
        email: req.body.email,
        _id: { $ne: id },
      });
      if (exStudent) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another student",
        });
      }
    }
    if (req.body.age && req.body.age < 18) {
      return res
        .status(400)
        .json({ success: false, message: "Age must be 18 or above" });
    }

    let updateStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "Student data updated",
      data: updateStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const deleteSingleStudentController = async (req, res) => {
  try {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student id" });
    }

    let exStudent = await Student.findById(id);
    if (!exStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    // Delete validation
    if (exStudent.enrolledCourses && exStudent.enrolledCourses.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete. Student is already enrolled in courses.",
      });
    }

    await Student.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const enrollStudentController = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student or course id" });
    }

    const exStudent = await Student.findById(studentId);
    if (!exStudent)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    const exCourse = await Course.findById(courseId);
    if (!exCourse)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (!exCourse.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Cannot enroll. Course is not published yet.",
      });
    }

    const isEnrolled = exStudent.enrolledCourses.includes(courseId);
    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in this course",
      });
    }

    exStudent.enrolledCourses.push(courseId);
    await exStudent.save();

    return res
      .status(200)
      .json({ success: true, message: "Course successfully enrolled" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

module.exports = {
  registrationStudentController,
  allStudentController,
  singleStudentController,
  updateSingleStudentController,
  deleteSingleStudentController,
  enrollStudentController,
};
