const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Middleware: chỉ cho phép admin đã đăng nhập mới được truy cập
function authorizeAdmin(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới có quyền thực hiện thao tác này" });
    }

    req.user = decoded; // lưu userId, role vào request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

module.exports = authorizeAdmin;
