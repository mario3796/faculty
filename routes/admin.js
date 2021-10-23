const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get('/add-user', adminController.getAddUser);

module.exports = router;