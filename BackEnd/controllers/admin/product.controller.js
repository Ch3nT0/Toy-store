const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination")
const searchHelper = require("../../helpers/search")
const Review = require("../../models/review.model");

// [GET] [ADMIN]/products?page=__&limit=__&keyword=__&&minPrice=__&maxPrice=__&discount=__
module.exports.getProducts = async (req, res) => {
    try {
        const query = req.query;
        const search = searchHelper(req.query);
        // --- Lọc ---
        const filter = { ...search };
        if (query.minPrice || query.maxPrice) {
            filter.price = {};
            if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
            if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
        }
        // --- Lọc theo giảm giá (discount) ---
        if (query.discount) {
            filter.discount = { $gte: parseFloat(query.discount) };
        }

        let sortObject = { createdAt: -1 }; // Mặc định sắp xếp theo thời gian tạo mới nhất

        if (query.sortBy && query.sortOrder) {
            const field = query.sortBy; // Ví dụ: 'price', 'inStock'
            const order = query.sortOrder === 'asc' ? 1 : -1; // 1: tăng dần, -1: giảm dần

            // Đặt đối tượng sắp xếp theo tham số từ frontend
            sortObject = { [field]: order };
        }

        const count = await Product.countDocuments(filter);
        const paging = paginationHelper(
            { currentPage: 1, limitItem: 10 },
            query,
            count
        );
        const products = await Product.find(filter)
            .select("name price discount images rating reviewCount inStock")
            .skip(paging.skip)
            .limit(paging.limitItem)
            .sort(sortObject); 

        res.json({
            code: 200,
            message: "Thành công",
            currentPage: paging.currentPage,
            totalPage: paging.totalPage,
            data: products
        });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi máy chủ khi lấy danh sách sản phẩm",
            error: error.message
        });
    }
};

// [GET] [ADMIN]/products/:id
module.exports.getProductByID = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });
    if (product) {
        const reviews = await Review.find({ productId: id }).select("userId rating comment createdAt");
        res.json({
            code: 200,
            message: "Thành công",
            data: {
                ...product.toObject(),
                reviews: reviews
            }
        });
    } else {
        res.json({
            code: 404,
            message: "Không tìm thấy sản phẩm"
        });
    }
};

//[POST] [ADMIN]/products
module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json({
        code: 200,
        message: "Tạo sản phẩm thành công",
    })
}

//[PUT] [ADMIN]/products/:id
module.exports.updateProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    );
    if (product) {
        res.json({
            code: 200,
            message: "Cập nhật sản phẩm thành công",
        })
    } else {
        res.json({
            code: 404,
            message: "Không tìm thấy sản phẩm"
        });
    }
}

// [PUT] [ADMIN]/products/update-many
module.exports.updateManyProducts = async (req, res) => {
    const updates = req.body;
    try {
        await Promise.all(updates.map(async (item) => {
            const { id, ...updateData } = item;
            const result = await Product.findOneAndUpdate(
                { _id: id },
                updateData,
                { new: true }
            );
        }));
        res.json({
            code: 200,
            message: `Cập nhật thành công `,
        });
    } catch (error) {
        res.json({
            code: 500,
            message: "Lỗi máy chủ khi cập nhật nhiều sản phẩm.",
            error: error.message
        });
    }
}

//[DELETE] [ADMIN]/products/:id
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.json({
        code: 200,
        message: "Xóa sản phẩm thành công",
    })
}