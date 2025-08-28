const productRoute = require("./product.route")
const categoryRoute = require("./category.route")

module.exports = (app)=>{
    app.use("/products",productRoute);
    app.use("/category",categoryRoute);
}