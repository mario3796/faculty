const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.get('/', userController.getIndex);

router.get('/user-details/:userId', userController.getUserDetails);

router.get('/students', userController.getStudents);

router.get('/instructors', userController.getInstructors);

router.get('/courses', userController.getCourses);

router.get('/course-details/:courseId', userController.getCourseDetails);

router.get('/instructor-courses', userController.getInstructorCourses);

router.post('/add-course', userController.postAddCourse);

router.get('/student-courses', userController.getStudentCourses);

router.post('/delete-course', userController.postDeleteCourse);

module.exports = router;