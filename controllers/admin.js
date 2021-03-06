const fs = require("fs");
const User = require("../models/user");
const Course = require("../models/course");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getAddUser = (req, res, next) => {
  res.render("admin/edit-user", {
    path: "/admin/add-user",
    title: "Add User",
    editing: false,
    errorMessage: null,
    validationErrors: [],
    hasError: false
  });
};

exports.postAddUser = (req, res, next) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const password = req.body.pwd;
  const userType = req.body.userType;
  const department = req.body.dept;
  const imageUrl = req.file ? req.file.path : null;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("admin/edit-user", {
      path: '/admin/add-user',
      title: 'Add User',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: validationResult(req).array(),
      hasError: true,
      user: {
        name: firstName + ' ' + lastName,
        email: email,
        password: password,
        user_type: userType,
        department: department
      }
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User();
      user.name = firstName + " " + lastName;
      user.email = email;
      user.password = hashedPassword;
      user.user_type = userType;
      user.department = department;
      user.imageUrl = imageUrl;
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      res.render("admin/edit-user", {
        path: "/admin/edit-user",
        title: "Edit User",
        editing: true,
        user: user,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditUser = (req, res, next) => {
  const userId = req.body.userId;
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const password = req.body.pwd;
  const userType = req.body.userType;
  const department = req.body.dept;
  const imageUrl = req.file ? req.file.path : null;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    if (imageUrl) {
      deleteImage(imageUrl);
    }
    return res.status(422).render('admin/edit-user', {
      path: '/admin/edit-user',
      title: 'Edit User',
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: validationResult(req).array(),
      user: {
        name: firstName + ' ' + lastName,
        email: email,
        password: password,
        user_type: userType,
        department: department,
        _id: userId 
      },
    })
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      User.findById(userId)
        .then((user) => {
          if (user.user_type !== userType && user.user_type === 'instructor') {
            user.courses = [];
            Course.find({ instructor: user._id }, async(err, courses) => {
              if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
              }
              const students = await User.find({user_type: 'student'});
              students.forEach(async (student) => {
                console.log('student courses', student.courses);
                let remainingCourses = student.courses.filter(
                  el => !courses.find(element => el.toString() == element._id.toString())
                );
                console.log('remaining courses', remainingCourses);
                student.courses = [...remainingCourses];
                await student.save();
              });
              await Course.deleteMany({instructor: user._id});
            });
            
          } else if (user.user_type !== userType && user.user_type === 'student') {
            user.courses = [];
            Course.find({ students: user._id }, (err, courses) => {
              if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
              }
              console.log('courses', courses);
              courses.forEach(async (course) => {
                console.log('course.students', course.students);
                let students = course.students.filter(
                  (student) => student.toString() != user._id.toString()
                );
                console.log('students', students);
                course.students = [...students];
                await course.save();
              });
            })
          }
          if (imageUrl) {
            deleteImage(user.imageUrl);
          }
          user.name = firstName + " " + lastName;
          user.email = email;
          user.password = hashedPassword;
          user.user_type = userType;
          user.department = department;
          user.imageUrl = imageUrl || user.imageUrl;
          return user.save();
        })
        .then((result) => {
          console.log(result);
          return res.redirect("/");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteUser = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndRemove(userId);
    if (user.user_type !== "instructor") {
      const courses = await Course.find({ students: user._id });
      courses.forEach(async (course) => {
        console.log("course students", course.students);
        let students = course.students.filter(
          (student) => student.toString() != user._id.toString()
        );
        console.log("students", students);
        course.students = [...students];
        await course.save();
      });
    } else {
      Course.find({ instructor: user._id }, async(err, courses) => {
        if (err) {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        }
        const students = await User.find({user_type: 'student'});
        students.forEach(async (student) => {
          console.log('student courses', student.courses);
          let remainingCourses = student.courses.filter(
            el => !courses.find(element => el.toString() == element._id.toString())
          );
          console.log('remaining courses', remainingCourses);
          student.courses = [...remainingCourses];
          await student.save();
        });
        await Course.deleteMany({instructor: user._id});
      });
    }
    deleteImage(user.imageUrl);
    res.redirect("/");
  } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
};

exports.getAddCourse = (req, res, next) => {
  User.find({ user_type: "instructor" })
    .then((users) => {
      res.render("admin/edit-course", {
        path: "/admin/add-course",
        title: "Add Course",
        editing: false,
        users: users,
        hasError: false,
        validationErrors: [],
        errorMessage: null,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddCourse = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.desc;
  const instructor = req.body.instructor;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return User.find({user_type: 'instructor'})
    .then(users => {
      return res.status(422).render('admin/edit-course', {
        path: "/admin/add-course",
          title: "Add Course",
          editing: false,
          users: users,
          hasError: true,
          validationErrors: validationResult(req).array(),
          errorMessage: errors.array()[0].msg,
          course: {
            name: name,
            description: description,
            instructor: instructor
          }
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }
  const course = new Course();
  course.name = name;
  course.description = description;
  course.instructor = instructor;
  course
    .save()
    .then((result) => {
      User.findById(instructor).then((user) => {
        console.log(result);
        user.courses.push(result);
        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/courses");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  try {
    const users = await User.find({ user_type: "instructor" });
    const course = await Course.findById(courseId);
    res.render("admin/edit-course", {
      path: "/admin/edit-course",
      title: "Edit Course",
      editing: true,
      course: course,
      users: users,
      hasError: false,
      validationErrors: [],
      errorMessage: null,
    });
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  const name = req.body.name;
  const description = req.body.desc;
  const instructor = req.body.instructor;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return User.find({user_type: 'instructor'})
    .then(users => {
      return res.status(422).render('admin/edit-course', {
        path: "/admin/edit-course",
        title: "Edit Course",
        editing: true,
        users: users,
        hasError: true,
        validationErrors: validationResult(req).array(),
        errorMessage: errors.array()[0].msg,
        course: {
          name: name,
          description: description,
          instructor: instructor,
          _id: courseId
        }
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }
  Course.findById(courseId)
    .then((course) => {
      course.name = name;
      course.description = description;
      course.instructor = instructor;
      return course.save();
    })
    .then((result) => res.redirect("/courses"))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  Course.findByIdAndRemove(courseId)
    .then((course) => {
      return User.find().then((users) => {
        users.forEach((user) => {
          user.courses = user.courses.filter(
            (course) => course._id.toString() != courseId.toString()
          );
          user.save();
        });
      });
    })
    .then((result) => {
      res.redirect("/courses");
    })
    .catch((err) => {
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