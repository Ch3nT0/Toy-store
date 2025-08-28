const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/product.controller");

router.get('/',controller.getProducts);
router.get('/:id',controller.getProductByID);
router.get('/Top/Discount',controller.getProductsTopDiscount);
router.get('/Top/Sale',controller.getProductsTopSale);


module.exports = router;