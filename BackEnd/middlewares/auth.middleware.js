const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
module.exports.requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({
            code: 400,
            message: "Vui lòng gửi kèm token"
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId, deleted: false }).select("-password");
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: "Token không hợp lệ"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
};


module.exports.optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.userId, deleted: false }).select("-password");
            req.user = user || null;
        } else {
            req.user = null;
        }
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};
