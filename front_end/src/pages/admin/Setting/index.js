import React, { useEffect, useState } from "react";
import { getAboutUs, updateAbout } from "../../../services/admin/aboutService";
import { handleUpload } from "../../../helpers/uploaFileToCloud"; // Import hàm utility

function SettingAdmin() {
    const [aboutUs, setAboutUs] = useState({
        tenCongty: "",
        diachi: "",
        email: "",
        sdt: "",
        facebook: "",
        instagram: "",
        tiktok: "",
        thumb: [], // Mảng URL ảnh
    });
    const [loading, setLoading] = useState(false); // Dùng cho cả fetch data và submit
    const [uploading, setUploading] = useState(false); // Dùng riêng cho trạng thái upload file
    const [newThumb, setNewThumb] = useState(""); // Dùng cho input nhập URL thủ công

    // Lấy dữ liệu ban đầu
    useEffect(() => {
        const fetchFooter = async () => {
            setLoading(true); // Bắt đầu loading fetch data
            try {
                const res = await getAboutUs();
                // Đảm bảo thumb là một mảng khi set state
                setAboutUs({
                    ...res.data,
                    thumb: res.data.thumb || [], 
                });
            } catch (error) {
                console.error("Error fetching aboutUs:", error);
            } finally {
                 setLoading(false); // Kết thúc loading fetch data
            }
        };
        fetchFooter();
    }, []);

    // Xử lý input text (Công ty, Địa chỉ, Socials, v.v.)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutUs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * @description Xử lý tải file ảnh lên Cloudinary và thêm vào mảng thumb
     */
    const handleUploadThumbFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true); // Bắt đầu trạng thái upload
        try {
            // Sử dụng handleUpload utility để đẩy file lên
            const secureUrl = await handleUpload(file, "image");

            if (secureUrl) {
                setAboutUs((prev) => ({
                    ...prev,
                    thumb: [...prev.thumb, secureUrl],
                }));
            } else {
                alert("Tải ảnh lên Cloudinary thất bại!");
            }
        } catch (err) {
            alert(`Tải ảnh lên thất bại: ${err.message}`);
            console.error("Upload error:", err);
        } finally {
            setUploading(false); // Kết thúc trạng thái upload
            e.target.value = null; // Reset input file
        }
    };

    // Thêm thumb từ URL nhập tay
    const handleAddThumbUrl = () => {
        if (newThumb.trim() !== "") {
            setAboutUs((prev) => ({
                ...prev,
                thumb: [...prev.thumb, newThumb.trim()],
            }));
            setNewThumb("");
        }
    };

    // Xóa thumb
    const handleRemoveThumb = (index) => {
        setAboutUs((prev) => ({
            ...prev,
            thumb: prev.thumb.filter((_, i) => i !== index),
        }));
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploading) {
            alert("Vui lòng chờ quá trình upload ảnh hoàn tất.");
            return;
        }
        setLoading(true);
        try {
            await updateAbout(aboutUs);
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi cập nhật!");
        } finally {
            setLoading(false);
        }
    };

    // Bạn có thể thêm loading spinner nếu cần
    if (loading && !aboutUs.tenCongty) return <p className="text-center text-xl mt-12">Đang tải cấu hình...</p>;


    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-3">
                Cài đặt Thông tin & Gallery
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* --- THÔNG TIN CHUNG --- */}
                <h2 className="text-xl font-semibold text-blue-600 pt-4">Thông tin liên hệ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Tên công ty */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty</label>
                        <input type="text" name="tenCongty" value={aboutUs.tenCongty || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150" />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" value={aboutUs.email || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150" />
                    </div>

                    {/* SĐT */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input type="text" name="sdt" value={aboutUs.sdt || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150" />
                    </div>
                </div>

                {/* Địa chỉ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <textarea name="diachi" value={aboutUs.diachi || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-y" rows="3" />
                </div>
                
                {/* --- SOCIAL MEDIA --- */}
                <h2 className="text-xl font-semibold text-blue-600 pt-4">Mạng xã hội</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Facebook */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                        <input type="text" name="facebook" value={aboutUs.facebook || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150" />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <input type="text" name="instagram" value={aboutUs.instagram || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150" />
                    </div>

                    {/* TikTok */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                        <input type="text" name="tiktok" value={aboutUs.tiktok || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150" />
                    </div>
                </div>


                {/* --- THUMBNAIL GALLERY --- */}
                <h2 className="text-xl font-semibold text-blue-600 pt-4">Gallery Ảnh Thumbnail</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quản lý Ảnh (Tổng số: {aboutUs.thumb?.length || 0})</label>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                         {/* OPTION 1: UPLOAD FILE */}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadThumbFile}
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                                disabled={uploading}
                            />
                            {uploading && <p className="text-xs text-blue-500 mt-1">Đang upload file...</p>}
                        </div>

                        {/* OPTION 2: NHẬP URL THỦ CÔNG */}
                        <div className="flex gap-2 w-full sm:w-1/2">
                            <input
                                type="url"
                                placeholder="Hoặc nhập URL ảnh có sẵn"
                                value={newThumb}
                                onChange={(e) => setNewThumb(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                disabled={uploading}
                            />
                            <button
                                type="button"
                                onClick={handleAddThumbUrl}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                                disabled={uploading || newThumb.trim() === ""}
                            >
                                Thêm URL
                            </button>
                        </div>
                    </div>

                    {/* DANH SÁCH THUMBNAIL ĐÃ CÓ */}
                    <div className="flex flex-wrap gap-4 mt-5 p-4 bg-gray-50 rounded-lg border">
                        {aboutUs.thumb?.length > 0 ? (
                            aboutUs.thumb.map((url, i) => (
                                <div
                                    key={i}
                                    className="relative group w-28 h-28 border border-gray-300 rounded-lg overflow-hidden shadow-md"
                                >
                                    <img
                                        src={url}
                                        alt={`thumb-${i}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveThumb(i)}
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                        title="Xóa ảnh"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">Chưa có ảnh nào trong Gallery.</p>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-150 shadow-md"
                    >
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SettingAdmin;
