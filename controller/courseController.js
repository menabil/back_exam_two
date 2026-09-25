const mongoose = require("mongoose");
let Course = require("../model/courseModel");
let Student = require("../model/studentModel");

const registrationCourseController = async (req, res) => {
  try {
    let { title, description, price, category, duration } = req.body;

    if (!title || !description || !price || !category || !duration) {
      return res.status(400).json({
        success: false,
        message: "Please give all information",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please give a valid price",
      });
    }

    if (duration < 1) {
      return res.status(400).json({
        success: false,
        message: "Please give a long duration",
      });
    }

    let exCourse = await Course.findOne({
      title: title,
      category: category,
    });

    if (exCourse) {
      return res.status(400).json({
        success: false,
        message: "Course already exist",
      });
    }

    let newCourse = await new Course({
      title: title,
      description: description,
      price: price,
      category: category,
      duration: duration,
    }).save();

    return res.status(200).json({
      success: true,
      message: "New course created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const allCourseController = async (req, res) => {
  try {
    let allCourse = await Course.find({});

    return res.status(200).json({
      success: true,
      message: `Total course: ${allCourse.length}`,
      data: allCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const singleCourseController = async (req, res) => {
  try {
    let { id } = req.params;

    let exCourse = await Course.findById({ _id: id });

    if (!exCourse) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details",
      data: exCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const updateSingleCourseController = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, description, price, category, duration } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    let exCourse = await Course.findOne({ title, category });

    if (!exCourse) {
      return res.status(400).json({
        success: false,
        message: "Course already exist",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please give a valid price",
      });
    }

    if (duration < 1) {
      return res.status(400).json({
        success: false,
        message: "Please give a long duration",
      });
    }

    let updateCourse = await Student.findByIdAndUpdate(
      { _id: id },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Course data updated",
      data: updateCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const deleteSingleCourseController = async (req, res) => {
  try {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    let exCourse = await Course.findById({ _id: id });

    if (!exCourse) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    let deleteCourse = await Student.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Course no more",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const getCourseAtStudents = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    const exCourse = await Course.findById(id);

    if (!exCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const exStudent = await Student.find({ enrolledCourses: id });

    return res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      count: exStudent.length,
      data: exStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

module.exports = {
  registrationCourseController,
  allCourseController,
  singleCourseController,
  updateSingleCourseController,
  deleteSingleCourseController,
  getCourseAtStudents,
};
