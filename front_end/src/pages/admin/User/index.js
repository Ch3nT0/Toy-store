// UserAdmin.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getListUser } from "../../../services/admin/userService";

function UserAdmin() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchListUser = async () => {
            try {
                const res = await getListUser();
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchListUser();
    }, []);

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
                        <tr key={u._id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">{u._id}</td>
                            <td className="border border-gray-300 p-2">{u.fullName}</td>
                            <td className="border border-gray-300 p-2">{u.email}</td>
                            <td className="border border-gray-300 p-2 text-center">
                                <Link
                                    to={`/admin/users/detail/${u._id}`}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Xem chi tiết
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserAdmin;
