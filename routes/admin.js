const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const adminController = require("../controllers/admin");
const User = require("../models/user");
const Course = require("../models/course");

const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");

router.get('/add-user',isAuth, isAdmin, adminController.getAddUser);

router.post('/add-user',isAuth, isAdmin, [
    body('fname').trim().isLength({min: 3}).withMessage('please enter a valid name!'),
    body('lname').trim().isLength({min: 3}).withMessage('please enter a valid name!'),
    body('email').notEmpty().isEmail().withMessage('please enter a valid email!')
    .custom(value => {
        return User.findOne({email: value})
        .then(user => {
            if (user) {
                return Promise.reject("email already exists!");
            }
        })
    }),
    body('pwd').trim().isLength({min: 5}).withMessage('password must not less 5 characters!'),
    body('userType').notEmpty().withMessage('please choose a user type!'),
    body('dept').trim().isLength({min: 2}).withMessage('please enter a valid department name!'),
]
, adminController.postAddUser);

router.get('/edit-user/:userId',isAuth, isAdmin, adminController.getEditUser);

router.post('/edit-user',isAuth, isAdmin, [
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
    body('userType').notEmpty().withMessage('please choose a user type!'),
    body('dept').trim().isLength({min: 2}).withMessage('please enter a valid department name!'),
]
, adminController.postEditUser);

router.post('/delete-user',isAuth, isAdmin, adminController.postDeleteUser);

router.get('/add-course',isAuth, isAdmin, adminController.getAddCourse);

router.post('/add-course',isAuth, isAdmin, [
    body('name').trim().isLength({min: 2}).withMessage('please fill the name!')
    .custom(value => {
        return Course.findOne({name: value})
        .then(course => {
            if (course) {
                return Promise.reject('name already exists pick a different one!');
            }
        })
    }),
    body('desc').trim().isLength({min: 20}).withMessage('description must not less than 20 characters!'),
    body('instructor').notEmpty().withMessage('please choose an instructor!')
], adminController.postAddCourse);

router.get('/edit-course/:courseId', isAuth, isAdmin, adminController.getEditCourse);

router.post('/edit-course', isAuth, isAdmin, [
    body('name').trim().isLength({min: 2}).withMessage('please fill the name!')
    .custom((value, {req}) => {
        return Course.findOne({name: value})
        .then(course => {
            if (course && course._id != req.body.courseId) {
                return Promise.reject('name already exists pick a different one!');
            }
        })
    }),
    body('desc').trim().isLength({min: 20}).withMessage('description must not less than 20 characters!'),
    body('instructor').notEmpty().withMessage('please choose an instructor!')
] , adminController.postEditCourse);

router.post('/delete-course',isAuth, isAdmin, adminController.postDeleteCourse);

module.exports = router;