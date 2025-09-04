const Client = require("../../models/client.model");
const User = require("../../models/user.model");

// [POST] /client
module.exports.register = async (req, res) => {
    const userId = req.user._id;
    const { fullName, phone, address } = req.body;
    const client = new Client({
        fullName,
        phone,
        address,
        userId
    });
    await client.save();
    res.json({ code: 200, message: "Đăng ký thành công",data:client });
};

// [PUT] /client/:id
module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, address } = req.body;
        const client = await Client.findByIdAndUpdate(
            id,
            { fullName, phone, address },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy client" });
        }

        res.json({ code: 200, message: "Cập nhật thành công", data: client });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};

// [GET] /client/detail
module.exports.detail = async (req, res) => {
    const userId = req.user._id;
    const Clients = await Client.find({userId:userId});
    res.json({ code: 200, message: "Thành công", data: Clients });
};

// [DELETE] /client/:id
module.exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndUpdate(
            id,
            { deleted: true, deleteAt: new Date() },
            { new: true }
        );
        if (!client) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy client" });
        }
        res.json({ code: 200, message: "Xóa thành công", data: client });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};