const Category = require("../../models/category.model");

// [GET] /category
module.exports.getCategorys = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({
            code: 200,
            message: "Categories retrieved successfully",
            data: categories
        });
    }catch{
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /category/:id
module.exports.getCategoryByID = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                code: 404,
                message: "Category not found"
            });
        }
        res.json({
            code: 200,
            message: "Category retrieved successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Lỗi server",
            error: error.message
        });
    }
};
