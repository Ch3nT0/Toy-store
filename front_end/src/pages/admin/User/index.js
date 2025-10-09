// UserAdmin.jsx
import { useEffect, useState } from "react";
import { getListUser } from "../../../services/admin/userService";

function UserAdmin() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchListUser = async () => {
            try {
                const res = await getListUser();
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchListUser();
    }, []);

    // Xóa user
    const deleteUser = (id) => {
        setUsers(users.filter((u) => u.id !== id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>

            {/* Bảng danh sách user */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Tên</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">{u._id}</td>
                            <td className="border border-gray-300 p-2">{u.fullName}</td>
                            <td className="border border-gray-300 p-2">{u.email}</td>
                            <td className="border border-gray-300 p-2 text-center">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                                    Sửa
                                </button>
                                <button
                                    onClick={() => deleteUser(u.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Nút thêm user */}
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                + Thêm người dùng
            </button>
        </div>
    );
}

export default UserAdmin;
