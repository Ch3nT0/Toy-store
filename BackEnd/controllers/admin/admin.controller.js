const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin.model");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// [POST] /login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email, deleted: false });
        if (!admin) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }

        const token = jwt.sign({ userId: admin._id, role: admin.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({
            message: "Đăng nhập thành công", token,
            code: 200
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// [POST] /admins/register
exports.registerAdmin = async (req, res) => {
    try {
        const { fullName, email, password, phone, role } = req.body;

        const allowedRoles = ["admin", "product_manager", "account_manager", "support_staff"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Role không hợp lệ" });
        }
        if (role === "admin" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới có quyền tạo tài khoản admin" });
        }

        // Kiểm tra email đã tồn tại chưa
        const exists = await Admin.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản mới
        const newAccount = new Admin({
            fullName,
            email,
            password: hashedPassword,
            phone,
            role
        });

        await newAccount.save();

        res.status(201).json({
            message: "Tạo tài khoản thành công",
            account: {
                id: newAccount._id,
                fullName: newAccount.fullName,
                email: newAccount.email,
                phone: newAccount.phone,
                role: newAccount.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}