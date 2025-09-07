const productRoute = require("./product.route")
const categoryRoute = require("./category.route")
const orderRoute = require("./order.route")

module.exports = (app)=>{
    app.use("/admin/products",productRoute);
    app.use("/admin/category",categoryRoute);
    app.use("/admin/order",orderRoute);
}