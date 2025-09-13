const productRoute = require("./product.route")
const categoryRoute = require("./category.route")
const orderRoute = require("./order.route")
const dashboardRoute = require("./dashboard.route")
const userRoute = require("./user.route")
const aboutRoute = require("./aboutUs.route")
const adminRoute = require("./admin.route")


module.exports = (app)=>{
    app.use("/admin/products",productRoute);
    app.use("/admin/category",categoryRoute);
    app.use("/admin/order",orderRoute);
    app.use("/admin/dashboard",dashboardRoute);
    app.use("/admin/users",userRoute);
    app.use("/admin/aboutUs",aboutRoute);
    app.use("/admin/",adminRoute);
}