const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/order.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.get('/',requireAuth,controller.getOrdersByUser);
router.get('/:id',controller.getOrderByID);
router.post('/cart',requireAuth,controller.orderCart);
router.post('/',requireAuth,controller.orderProduct);
router.put('/:id',controller.updateOrderStatus);

module.exports = router;