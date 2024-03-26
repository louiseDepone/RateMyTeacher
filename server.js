require("dotenv").config();
const { db } = require("./configs/database");

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = process.env.PORT;




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

app.get("/", (req, res) => {
            try {
              db.query(
                "SELECT * FROM Students ;",
                (err, result) => {
                  if (err) {
                    console.error("erroe fetching items:", err);
                    res.status(500).json({ message: "Internal server error" });
                  } else {
                    res.status(200).json(result);
                  }
                }
              );
            } catch (error) {
              console.error("Error loading students:", error);
              res.status(500).json({ error: "interrnal server error" });
            }
});


 

app.listen(PORT, () => {
  console.log(`Server Address: http://localhost:${PORT}`);
});
