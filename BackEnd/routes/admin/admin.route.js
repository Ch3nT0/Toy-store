const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/admin.controller");
const authMiddleware = require("../../middlewares/authorizeAdmin");

router.post('/login',controller.loginAdmin);
router.post('/register',controller.registerAdmin);

module.exports = router;