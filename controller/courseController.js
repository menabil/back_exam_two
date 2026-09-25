const mongoose = require("mongoose");
const Course = require("../model/courseModel");
const Student = require("../model/studentModel");

const registrationCourseController = async (req, res) => {
  try {
    let { title, description, price, category, duration } = req.body;

    if (!title || !description || !price || !category || !duration) {
      return res
        .status(400)
        .json({ success: false, message: "Please give all information" });
    }
    if (price <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please give a valid price" });
    }
    if (duration < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Please give a valid duration" });
    }

    let exCourse = await Course.findOne({ title: title, category: category });
    if (exCourse) {
      return res
        .status(400)
        .json({ success: false, message: "Course already exists" });
    }

    let newCourse = await Course.create({
      title,
      description,
      price,
      category,
      duration,
    });
    return res
      .status(201)
      .json({ success: true, message: "New course created", data: newCourse });
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course id" });
    }

    let exCourse = await Course.findById(id);
    if (!exCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Course details", data: exCourse });
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
    let { title, category, price, duration } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course id" });
    }

    if (price !== undefined && price <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please give a valid price" });
    }
    if (duration !== undefined && duration < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Please give a valid duration" });
    }

    if (title && category) {
      let exCourse = await Course.findOne({
        title,
        category,
        _id: { $ne: id },
      });
      if (exCourse) {
        return res.status(400).json({
          success: false,
          message: "Course with this title and category already exists",
        });
      }
    }

    let updateCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

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
      return res
        .status(400)
        .json({ success: false, message: "Invalid course id" });
    }

    let deleteCourse = await Course.findByIdAndDelete(id);
    if (!deleteCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid course id" });
    }

    const exCourse = await Course.findById(id);
    if (!exCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const students = await Student.find({ enrolledCourses: id });
    return res
      .status(200)
      .json({ success: true, count: students.length, data: students });
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
