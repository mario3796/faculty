const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const adminController = require("../controllers/admin");
const User = require("../models/user");

const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");

router.get('/add-user',isAuth, isAdmin, adminController.getAddUser);

router.post('/add-user',isAuth, isAdmin, [
    body('fname').trim().notEmpty().isLength({min: 3}).withMessage('please enter a valid name!'),
    body('lname').trim().notEmpty().isLength({min: 3}).withMessage('please enter a valid name!'),
    body('email').notEmpty().isEmail().withMessage('please enter a valid email!')
    .custom(value => {
        return User.findOne({email: value})
        .then(user => {
            if (user) {
                return Promise.reject("email already exists!");
            }
        })
    }),
    body('pwd').trim().notEmpty().isLength({min: 5}).withMessage('password must not less 5 characters!'),
    body('userType').notEmpty().withMessage('please choose a user type!'),
    body('fname').trim().notEmpty().isLength({min: 2}).withMessage('please enter a valid department name!'),
]
, adminController.postAddUser);

router.get('/edit-user/:userId',isAuth, isAdmin, adminController.getEditUser);

router.post('/edit-user',isAuth, isAdmin, adminController.postEditUser);

router.post('/delete-user',isAuth, isAdmin, adminController.postDeleteUser);

router.get('/add-course',isAuth, isAdmin, adminController.getAddCourse);

router.post('/add-course',isAuth, isAdmin, adminController.postAddCourse);

router.get('/edit-course/:courseId', isAuth, isAdmin, adminController.getEditCourse);

router.post('/edit-course', isAuth, isAdmin, adminController.postEditCourse);

router.post('/delete-course',isAuth, isAdmin, adminController.postDeleteCourse);

module.exports = router;