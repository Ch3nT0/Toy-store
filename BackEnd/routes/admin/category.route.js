const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/category.controller");


router.get('/',controller.getCategorys);
router.get('/:id',controller.getCategoryByID);
router.post('/',controller.deleteCategory);
router.put("/:id",controller.updateCategory);
router.delete('/:id',controller.deleteCategory);

module.exports = router;