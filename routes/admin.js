const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get('/add-user', adminController.getAddUser);

router.post('/add-user', adminController.postAddUser);

router.get('/edit-user/:userId', adminController.getEditUser);

router.post('/edit-user', adminController.postEditUser);

router.post('/delete-user', adminController.postDeleteUser);

module.exports = router;