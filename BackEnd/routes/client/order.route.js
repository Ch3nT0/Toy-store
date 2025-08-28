const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/order.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.get('/',requireAuth,controller.getOrdersByUser);
router.get('/:id',controller.getOrderByID);
router.post('/cart',requireAuth,controller.orderCart);
router.post('/products/:id',controller.orderProduct);

module.exports = router;