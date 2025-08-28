const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/category.controller");


router.get('/',controller.getCategorys);
router.get('/:id',controller.getCategoryByID)


module.exports = router;