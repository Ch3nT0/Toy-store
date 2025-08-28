const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/aboutUs.controller");
router.get('/',controller.getAboutUs);

module.exports = router;