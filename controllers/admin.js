const User = require("../models/user");
const Course = require("../models/course");
const bcrypt = require("bcryptjs");

exports.getAddUser = (req, res, next) => {
  res.render("admin/edit-user", {
    path: "/admin/add-user",
    title: "Add User",
    editing: false,
  });
};

exports.postAddUser = (req, res, next) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const password = req.body.pwd;
  const userType = req.body.userType;
  const department = req.body.dept;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User();
      user.name = firstName + " " + lastName;
      user.email = email;
      user.password = hashedPassword;
      user.user_type = userType;
      user.department = department;
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
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
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      User.findById(userId)
        .then((user) => {
          user.name = firstName + " " + lastName;
          user.email = email;
          user.password = hashedPassword;
          user.userType = userType;
          user.department = department;
          return user.save();
        })
        .then((result) => {
          console.log(result);
          return res.redirect("/");
        });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteUser = (req, res, next) => {
  const userId = req.body.userId;
  User.findByIdAndRemove(userId)
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getAddCourse = (req, res, next) => {
  User.find({ user_type: "instructor" })
    .then((users) => {
      res.render("admin/edit-course", {
        path: "/admin/add-course",
        title: "Add Course",
        editing: false,
        users: users,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddCourse = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.desc;
  const instructorId = req.body.instructor;
  const course = new Course();
  course.name = name;
  course.description = description;
  course.instructorId = instructorId;
  course.save()
  .then(result => {
    User.findById(instructorId)
    .then(user => {
      user.courses.push({
        course_id: result._id,
        course_name: result.name
      });
      return user.save();
    })
  })
  .then(result => {
    console.log(result);
    res.redirect('/');
  })
  .catch(err => console.log(err));
};
