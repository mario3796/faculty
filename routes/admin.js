const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get('/add-user', adminController.getAddUser);

router.post('/add-user', adminController.postAddUser)

module.exports = router;