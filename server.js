require("dotenv").config();
const { db } = require("./configs/database");

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.get("/", (req, res) => {
  console.log("sad")
 res.send("Hello World");
})
const enrollmentRoute = require("./routes/enrollmentRoute");
const ratingRoute = require("./routes/ratingRoute");
const studentRatingRoute = require("./routes/studentRatingRoute");
const studentRoute = require("./routes/studentRoute");
const subjectRoute = require("./routes/subjectRoute");
const teacherRoute = require("./routes/teacherRoute");
const teacherSubjectRoute = require("./routes/teacherSubjectRoute");



app.use(cors());
app.use(bodyParser.json());

app.use("/", enrollmentRoute, ratingRoute, studentRatingRoute, studentRoute, subjectRoute, teacherRoute, teacherSubjectRoute);



app.listen(PORT, () => {
  console.log(`Server Address: http://${HOST}:${PORT}`);
});
