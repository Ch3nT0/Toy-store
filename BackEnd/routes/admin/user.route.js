const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/user.controller");

router.get('/detail',controller.detail);
router.get('/list',controller.list);

module.exports = router;