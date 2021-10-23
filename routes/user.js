const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.get('/', userController.getIndex);

module.exports = router;