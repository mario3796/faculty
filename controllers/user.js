const User = require("../models/user");
const Course = require("../models/course");

exports.getIndex = (req, res, next) => {
  User.find()
    .then((users) => {
      res.render("index", {
        path: "/",
        title: "Index",
        users: users,
      });
    })
    .catch((err) => console.log(err));
};

exports.getDetails = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      res.render("user-details", {
        path: "/user-details",
        title: "User Details",
        user: user,
      });
    })
    .catch((err) => console.log(err));
};

exports.getStudents = (req, res, next) => {
  User.find({ user_type: "student" })
    .then((users) => {
      res.render("index", {
        path: "/students",
        title: "Students",
        users: users,
      });
    })
    .catch((err) => console.log(err));
};

exports.getInstructors = (req, res, next) => {
  User.find({ user_type: "instructor" })
    .then((users) => {
      res.render("index", {
        path: "/instructor",
        title: "Instructors",
        users: users,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCourses = async (req, res, next) => {
  const users = await User.find({ user_type: "instructor" });
  const courses = await Course.find();
  try {
    res.render("courses", {
      path: "/courses",
      title: "Courses",
      courses: courses,
      users: users,
    });
  } catch (err) {
    console.log(err);
  }
};
