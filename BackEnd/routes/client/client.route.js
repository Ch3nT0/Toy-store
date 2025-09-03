const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/client.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/register",authMiddleware.optionalAuth,controller.register);
router.get("/detail",authMiddleware.optionalAuth, controller.detail);
router.put("/:id",authMiddleware.optionalAuth,controller.update);
router.delete("/:id",authMiddleware.optionalAuth,controller.remove);

module.exports = router;