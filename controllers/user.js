const User = require("../models/user");
const Course = require("../models/course");

exports.getIndex = (req, res, next) => {
  User.find({ user_type: {$ne: 'admin'} })
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

exports.getCourseDetails = (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId)
  .then(course => {
    res.render('course-details', {
      path: '/course-details',
      title: 'Course Details',
      course: course
    })
  })
  .catch(err => console.log(err));
};

exports.getInstructorCourses = (req, res, next) => {
    Course.find({instructorId: req.user._id})
    .then(courses => {
        res.render('courses', {
            path: '/instructor-courses',
            title: 'Instructor Courses',
            courses: courses
        });
    })
    .catch(err => console.log(err));
};

exports.postAddCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  User.findById(req.user._id)
  .then(user => {
    Course.findById(courseId)
    .then(course => {
      user.courses.push(course);
      return user.save();
    })
  })
  .then(result => {
    res.redirect('/');
  })
  .catch(err => console.log(err));
}

exports.getStudentCourses = async (req, res, next) => {
  User.findById(req.user._id)
  .then(user => {
    const courses = user.courses;
    User.find({user_type: 'instructor'})
    .then(users => {
      return res.render('courses', {
        path: '/student-courses',
        title: 'Student Courses',
        courses: courses,
        users: users
      })
    })
  })
  .catch(err => console.log(err));
}

exports.postDeleteCourse =  (req, res, next) => {
  const courseId = req.body.courseId;
  let courses = [...req.user.courses];
  courses = courses.filter(course => course._id.toString() != courseId);
  req.user.courses = [...courses];
  req.user.save()
  .then(result => {
    res.redirect("/student-courses");
  })
  .catch(err => console.log(err));
};