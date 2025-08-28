const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.get('/detail',
    authMiddleware.requireAuth,
    controller.detail
);
router.get('/list',
    authMiddleware.requireAuth,
    controller.list
);

module.exports = router;