const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/review.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.post('/order/product',requireAuth,controller.postReview)
router.put('/:id',requireAuth,controller.editReview)
router.delete('/:id',requireAuth,controller.deleteReview)

module.exports = router;