const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");

router.get('/add-user',isAuth, isAdmin, adminController.getAddUser);

router.post('/add-user',isAuth, isAdmin, adminController.postAddUser);

router.get('/edit-user/:userId',isAuth, isAdmin, adminController.getEditUser);

router.post('/edit-user',isAuth, isAdmin, adminController.postEditUser);

router.post('/delete-user',isAuth, isAdmin, adminController.postDeleteUser);

router.get('/add-course',isAuth, isAdmin, adminController.getAddCourse);

router.post('/add-course',isAuth, isAdmin, adminController.postAddCourse);

router.post('/delete-course',isAuth, isAdmin, adminController.postDeleteCourse);

module.exports = router;