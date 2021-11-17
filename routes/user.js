const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const userController = require("../controllers/user");
const User = require("../models/user");

router.get('/', userController.getIndex);

router.get('/user-details/:userId', userController.getUserDetails);

router.get('/students', userController.getStudents);

router.get('/instructors', userController.getInstructors);

router.get('/courses', userController.getCourses);

router.get('/course-details/:courseId', userController.getCourseDetails);

router.get('/instructor-courses', userController.getInstructorCourses);

router.get('/add-course', userController.getAddCourse);

router.post('/add-course', userController.postAddCourse);

router.get('/student-courses', userController.getStudentCourses);

router.post('/delete-course', userController.postDeleteCourse);

router.get('/profile', userController.getProfile);

router.get('/edit-profile', userController.getEditProfile);

router.post('/edit-profile', [
    body('fname').trim().isLength({min: 3}).withMessage('please enter a valid name!'),
    body('lname').trim().isLength({min: 3}).withMessage('please enter a valid name!'),
    body('email').notEmpty().isEmail().withMessage('please enter a valid email!')
    .custom((value, {req}) => {
        return User.findOne({email: value})
        .then(user => {
            if (user && user._id != req.body.userId) {
                return Promise.reject("email already exists!");
            }
        })
    }),
    body('pwd').trim().isLength({min: 5}).withMessage('password must not less 5 characters!'),
], userController.postEditProfile);

router.get('/course-students/:courseId', userController.getCourseStudents);

module.exports = router;