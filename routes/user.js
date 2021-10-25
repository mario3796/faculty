const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.get('/', userController.getIndex);

router.get('/user-details/:userId', userController.getDetails);

module.exports = router;