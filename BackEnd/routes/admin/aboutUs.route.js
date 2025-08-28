const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/aboutUs.controller");
router.get('/',controller.getAboutUs);
router.patch('/',controller.updateAboutUs);

module.exports = router;