const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.get('/', userController.getIndex);

router.get('/user-details/:userId', userController.getDetails);

router.get('/students', userController.getStudents);

router.get('/instructors', userController.getInstructors);

router.get('/courses', userController.getCourses);

module.exports = router;