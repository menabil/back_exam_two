require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoute = require("./router/studentRoute");
const courseRoute = require("./router/courseRouter");
const mongoDB = require("./config/mongodbConnection");

const app = express();
app.use(express.json());
app.use(cors());
mongoDB();

app.use("/api/v1/student", studentRoute);
app.use("/api/v1/course", courseRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
