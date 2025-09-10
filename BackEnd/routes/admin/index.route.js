const productRoute = require("./product.route")
const categoryRoute = require("./category.route")
const orderRoute = require("./order.route")
const dashboardRoute = require("./dashboard.route")
const userRoute = require("./user.route")

module.exports = (app)=>{
    app.use("/admin/products",productRoute);
    app.use("/admin/category",categoryRoute);
    app.use("/admin/order",orderRoute);
    app.use("/admin/dashboard",dashboardRoute);
    app.use("/admin/users",userRoute);
}