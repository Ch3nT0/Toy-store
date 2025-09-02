const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generate = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// [POST] /users/register
module.exports.register = async (req, res) => {
    const { fullName, email, password } = req.body;
    const existEmail = await User.findOne({ email, deleted: false });
    if (existEmail) {
        return res.json({ code: 400, message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        fullName,
        email,
        password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie("token", token, { httpOnly: true });
    res.json({ code: 200, message: "Đăng ký thành công", token });
};

// [POST] /users/login
module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, deleted: false });
    if (!user) {
        return res.json({ code: 400, message: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({ code: 400, message: "Sai mật khẩu" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie("token", token, { httpOnly: true });
    res.json({ code: 200, message: "Đăng nhập thành công", token });
};

// [POST] /users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email, deleted: false });

    if (!user) {
        return res.json({ code: 400, message: "Email không tồn tại" });
    }

    const otp = generate.generateRandomNumber(8);
    const expireAt = Date.now() + 5 * 60 * 1000; // 5 phút

    await ForgotPassword.create({ otp, email, expireAt });

    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP của bạn là: <b>${otp}</b>. Có hiệu lực trong 5 phút.`;

    sendMailHelper.senMail(email, subject, html);

    res.json({ code: 200, message: "Đã gửi mã OTP qua email" });
};

// [POST] /users/password/otp
module.exports.otpPassword = async (req, res) => {
    const { email, otp } = req.body;

    const record = await ForgotPassword.findOne({ email, otp });
    if (!record || Date.now() > record.expireAt) {
        return res.json({ code: 400, message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie("token", token, { httpOnly: true });
    res.json({ code: 200, message: "Xác thực thành công", token });
};

// [POST] /users/password/reset
module.exports.resetPassword = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const { password } = req.body;

    if (!token) {
        return res.json({ code: 400, message: "Không tìm thấy token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        const isSame = await bcrypt.compare(password, user.password);
        if (isSame) {
            return res.json({ code: 400, message: "Mật khẩu mới không được trùng với mật khẩu cũ" });
        }

        const newHashed = await bcrypt.hash(password, 10);
        user.password = newHashed;
        await user.save();

        res.json({ code: 200, message: "Đổi mật khẩu thành công" });
    } catch (err) {
        res.json({ code: 400, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

// [GET] /users/detail
module.exports.detail = async (req, res) => {
    res.json({ code: 200, message: "Thành công", data: req.user });
};

