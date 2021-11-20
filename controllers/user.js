const bcrypt = require("bcryptjs");
const fs = require("fs");
const { validationResult } = require("express-validator");

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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddCourse = (req, res, next) => {
  Course.find().populate('instructor')
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
        res.render("courses", {
          path: "/add-course",
          title: "Register Course",
          courses: courses,
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  Course.findById(courseId)
  .then(course => {
    req.user.courses.push(course);
    course.students.push(req.user);
    course.save();
    req.user.save();
  })
  .then((result) => {
      res.redirect("/add-course");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getStudentCourses = async (req, res, next) => {
  Course.find({students: req.user}).populate('instructor')
    .then((courses) => {
        return res.render("courses", {
          path: "/student-courses",
          title: "Student Courses",
          courses: courses,
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  Course.findById(courseId)
  .then(course => {
    let students = course.students.filter(student => student.toString() != req.user._id.toString());
    console.log(students);
    course.students = [...students];
    return course.save();
  })
  .then(result => {
    let courses = req.user.courses.filter(course => course._id.toString() != courseId.toString());
    console.log(courses);
    req.user.courses = [...courses];
    return req.user.save();
  })
  .then(result => {
    res.redirect("/student-courses");
  })
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
  .then(user => {
    res.render('user-details', {
      path: '/profile',
      title: 'My Profile',
      user: user
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
};

exports.getEditProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
  .then(user => {
    res.render('admin/edit-user', {
      path: '/edit-profile',
      title: 'Edit Profile',
      user: user,
      editing: true,
      errorMessage: null,
      validationErrors: [],
      hasError: false
    })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

exports.postEditProfile = (req, res, next) => {
  const userId = req.body.userId;
  const firstName = req.body.fname;
  const lastName = req.body.lname || '';
  const imageUrl = req.file ? req.file.path : req.user.imageUrl;
  const email = req.body.email;
  const password = req.body.pwd;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
      return res.status(422).render('admin/edit-user', {
        path: '/edit-profile',
        title: 'Edit Profile',
        user: {
          name: (firstName + ' ' + lastName).trim(),
          email: email,
          password: password,
          _id: userId
        },
        editing: true,
        hasError: true,
        errorMessage: errors.array()[0].msg,
        validationErrors: validationResult(req).array()
    })
  }
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
    res.redirect('/profile');
  })
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCourseStudents = (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId).populate('students')
  .then(course => {
    res.render('course-students', {
      path: '/course-students',
      title: 'Course Students',
      course: course
    })
  })
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const deleteImage = (image) => {
  fs.unlink(image, err => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
    console.log('file deleted.');
  })
}