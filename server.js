require("dotenv").config();
const { db } = require("./configs/database");

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = 3300;
const HOST = process.env.HOST;

app.get("/downTimeCheck", (req, res) => {
  console.log("Okay this is the veyr root and onlyfor testing")
 res.status(200).send("Hello World");
})
const enrollmentRoute = require("./routes/enrollmentRoute");
const ratingRoute = require("./routes/ratingRoute");
const studentRatingRoute = require("./routes/studentRatingRoute");
const studentRoute = require("./routes/studentRoute");
const subjectRoute = require("./routes/subjectRoute");
const teacherRoute = require("./routes/teacherRoute");
const teacherSubjectRoute = require("./routes/teacherSubjectRoute");
const pinpostRoute = require("./routes/pinpostRoute");



app.use(cors());
app.use(bodyParser.json());

app.use("/", enrollmentRoute, ratingRoute, studentRatingRoute, studentRoute, subjectRoute, teacherRoute, teacherSubjectRoute, pinpostRoute);



app.listen(PORT, () => {
  console.log(`Server Address: http://${HOST}:${PORT}`);
});
