const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Course = require("../models/course");

exports.getIndex = (req, res, next) => {
  User.find({ user_type: { $ne: "admin" } })
    .then((users) => {
      res.render("index", {
        path: "/",
        title: "Index",
        users: users,
      });
    })
    .catch((err) => console.log(err));
};

exports.getUserDetails = (req, res, next) => {
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

exports.getCourses = (req, res, next) => {
  Course.find().populate('instructor')
  .then(courses => {
    res.render("courses", {
      path: "/courses",
      title: "Courses",
      courses: courses,
    });
  })
  .catch(err => console.log(err));
};

exports.getCourseDetails = (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId).populate('instructor')
    .then((course) => {
      res.render("course-details", {
        path: "/course-details",
        title: "Course Details",
        course: course,
      });
    })
    .catch((err) => console.log(err));
};

exports.getInstructorCourses = (req, res, next) => {
  Course.find({ instructor: req.user._id })
    .then((courses) => {
      res.render("courses", {
        path: "/instructor-courses",
        title: "Instructor Courses",
        courses: courses,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddCourse = async (req, res, next) => {
  Course.find()
    .then((courses) => {
      let remainingCourses = [];
      if (req.user.courses.length > 0) {
        console.log(req.user.courses);
        courses.forEach((i) => {
          let isRegistered = false;
          req.user.courses.forEach((j) => {
            if (i._id.toString() == j._id.toString()) {
              isRegistered = true;
            }
          });
          if (!isRegistered) {
            remainingCourses.push(i);
          }
        });
        if (remainingCourses.length > 0) {
          courses = [...remainingCourses];
        } else {
          courses = [];
        }
      }
      User.find({ user_type: "instructor" }).then((users) => {
        res.render("courses", {
          path: "/add-course",
          title: "Register Course",
          courses: courses,
          users: users,
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  User.findById(req.user._id)
    .then((user) => {
      Course.findById(courseId).then((course) => {
        user.courses.push(course);
        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/add-course");
    })
    .catch((err) => console.log(err));
};

exports.getStudentCourses = async (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      const courses = user.courses;
      User.find({ user_type: "instructor" }).then((users) => {
        return res.render("courses", {
          path: "/student-courses",
          title: "Student Courses",
          courses: courses,
          users: users,
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  let courses = [...req.user.courses];
  courses = courses.filter((course) => course._id.toString() != courseId);
  req.user.courses = [...courses];
  req.user
    .save()
    .then((result) => {
      res.redirect("/student-courses");
    })
    .catch((err) => console.log(err));
};

exports.getProfile = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId.match(/^[0-9a-fA-F]{24}$/))
  .then(user => {
    res.render('user-details', {
      path: '/profile',
      title: 'My Profile',
      user: user
    })
    .catch(err => console.log(err));
  })
};

exports.getEditProfile = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
  .then(user => {
    console.log(user);
    res.render('admin/edit-user', {
      path: '/edit-profile',
      title: 'Edit Profile',
      user: user,
      editing: true
    })
  })
  .catch(err => console.log(err));
}

exports.postEditProfile = (req, res, next) => {
  const userId = req.body.userId;
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const imageUrl = req.file.path;
  const email = req.body.email;
  const password = req.body.pwd;

  bcrypt.hash(password, 12)
  .then(hashedPwd => {
    User.findById(userId)
    .then(user => {
      user.name = (firstName + ' ' + lastName).trim();
      user.imageUrl = imageUrl;
      user.email = email;
      user.password = hashedPwd;
      return user.save();
    })
  })
  .then(result => {
    res.redirect('/profile/'+userId);
  })
  .catch(err => console.log(err));
}