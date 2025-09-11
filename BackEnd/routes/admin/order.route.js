const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");

router.get('/user/:id',controller.getOrdersByUser);
router.get('/:id',controller.getOrderByID);
router.get('/',controller.getOrders);
router.get('/revenue/6-months',controller.getRevenueLast6Months);
router.delete('/:id',controller.deleteOrderByID);

module.exports = router;