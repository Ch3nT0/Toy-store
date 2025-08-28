const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
router.get('/',requireAuth,controller.getCart);
router.put('/',requireAuth,controller.updateCart)
router.delete('/:productId',requireAuth,controller.deleteFromCart)
router.patch('/increase/:productId',requireAuth,controller.increaseQuantity)
router.patch('/decrease/:productId',requireAuth,controller.decreaseQuantity)


module.exports = router;