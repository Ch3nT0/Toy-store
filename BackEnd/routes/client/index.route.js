const userRoute = require("./user.route");
const productRoute = require("./product.route")
const cartRoute= require("./cart.route")
const orderRoute = require("./order.route")
const categoryRoute = require("./category.route");
const reviewRoute = require("./review.route")
const aboutUs = require("./aboutUs.route");
const client = require("./client.route")

module.exports = (app)=>{
    app.use("/users",userRoute);
    app.use("/products",productRoute);
    app.use("/cart",cartRoute);
    app.use("/order",orderRoute);
    app.use("/category",categoryRoute);
    app.use("/review",reviewRoute);
    app.use("/about",aboutUs);
    app.use("/client",client);
}