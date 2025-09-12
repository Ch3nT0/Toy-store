import { useEffect, useState } from "react";
import { getAboutUs, updateAbout } from "../../../services/admin/aboutService";

function SettingAdmin() {
  const [aboutUs, setAboutUs] = useState({
    tenCongty: "",
    diachi: "",
    email: "",
    sdt: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    thumb: [],
  });
  const [loading, setLoading] = useState(false);
  const [newThumb, setNewThumb] = useState("");

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await getAboutUs();
        setAboutUs(res.data);
      } catch (error) {
        console.error("Error fetching aboutUs:", error);
      }
    };
    fetchFooter();
  }, []);

  // Xử lý input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutUs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Thêm thumb
  const handleAddThumb = () => {
    if (newThumb.trim() !== "") {
      setAboutUs((prev) => ({
        ...prev,
        thumb: [...prev.thumb, newThumb],
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Cài đặt Footer & Thumbnail
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên công ty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên công ty
          </label>
          <input
            type="text"
            name="tenCongty"
            value={aboutUs.tenCongty || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <textarea
            name="diachi"
            value={aboutUs.diachi || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={aboutUs.email || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* SĐT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            name="sdt"
            value={aboutUs.sdt || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Facebook */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facebook
          </label>
          <input
            type="text"
            name="facebook"
            value={aboutUs.facebook || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instagram
          </label>
          <input
            type="text"
            name="instagram"
            value={aboutUs.instagram || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* TikTok */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            TikTok
          </label>
          <input
            type="text"
            name="tiktok"
            value={aboutUs.tiktok || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail
          </label>
          <div className="space-y-3">
            {aboutUs.thumb?.map((url, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
              >
                <img
                  src={url}
                  alt={`thumb-${i}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveThumb(i)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Nhập link ảnh mới"
              value={newThumb}
              onChange={(e) => setNewThumb(e.target.value)}
              className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddThumb}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}

export default SettingAdmin;
