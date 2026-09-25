const mongoose = require("mongoose");
let Student = require("../model/studentModel");
let Course = require("../model/courseModel");

const registrationStudentController = async (req, res) => {
  try {
    let { name, email, phone, age, enrolledCourses } = req.body;

    if (!name || !email || !phone || !age) {
      return res.status(400).json({
        success: false,
        message: "Please give all information",
      });
    }

    let exUser = await Student.findOne({ email: email });

    if (exUser) {
      return res.status(400).json({
        success: false,
        message: "Student already exist",
      });
    }

    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "Age is too low",
      });
    }

    let newUser = await new Student({
      name: name,
      email: email,
      phone: phone,
      age: age,
      enrolledCourses: enrolledCourses,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Student user created",
    });
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

    if (!allStudent) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

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
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    let exUser = await Student.findById({ _id: id }).populate(
      "enrolledCourses",
    );

    if (!exUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details",
      data: exUser,
    });
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
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    let exStudent = await Student.findOne({ email: req.body.email });

    if (exStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exist",
      });
    }

    if (req.body.age < 18) {
      return res.status(400).json({
        success: false,
        message: "Age is too low",
      });
    }

    let updateStudent = await Student.findByIdAndUpdate({ _id: id }, req.body, {
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
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    let deleteStudent = await Student.findByIdAndDelete({ _id: id });

    if (updateStudent.enrolledCourses) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student no more",
    });
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
      return res.status(400).json({
        success: false,
        message: "Invalid student id",
      });
    }

    const exStudent = await Student.findById(studentId);

    if (!exStudent) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const exCourse = await Course.findById(courseId);

    if (!exCourse) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!exCourse.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Course not published",
      });
    }

    const isEnrolledStudent = exStudent.enrolledCourses.includes(courseId);

    if (isEnrolledStudent) {
      return res.status(400).json({
        success: false,
        message: "Course already exits",
      });
    }

    isEnrolledStudent.enrolledCourses.push(courseId);

    await isEnrolledStudent.save();

    return res.status(200).json({
      success: true,
      message: "Course enrolled",
    });
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
