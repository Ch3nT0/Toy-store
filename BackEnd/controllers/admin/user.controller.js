const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const generate = require("../../helpers/generate");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// [GET] /users/detail
module.exports.detail = async (req, res) => {
    res.json({ code: 200, message: "Thành công", info: req.user });
};

//[GET] /users
module.exports.list = async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ code: 200, message: "Thành công", info: users });
}

