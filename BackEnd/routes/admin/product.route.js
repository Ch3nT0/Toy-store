const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");

router.get('/',controller.getProducts);
router.get('/:id',controller.getProductByID);
router.put("/update-many",controller.updateManyProducts);
router.post('/',controller.createProduct);
router.put("/:id",controller.updateProduct);
router.delete("/:id",controller.deleteProduct);

module.exports = router;