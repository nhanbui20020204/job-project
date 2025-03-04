"use client";

import { useRouter } from "next/navigation";
import {
  UserOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  BranchesOutlined,
  KeyOutlined,
  FundProjectionScreenOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path: string; 
}

const AdminSidebar: React.FC<{ handleLogout: () => void }> = ({ handleLogout }) => {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { title: "Quản lý người dùng", icon: UserOutlined, path: "/admin/User" },
    { title: "Quản lý tin tuyển dụng", icon: UnorderedListOutlined, path: "/admin/Job" },
    // { title: "Quản lý ứng viên", icon: FileTextOutlined, path: "/candidates" },
    { title: "Quản lý công ty", icon: ApartmentOutlined, path: "/admin/company" },
    { title: "Quản lý thể loại", icon: BranchesOutlined, path: "/admin/category" },
    { title: "Quản lý phân quyền", icon: KeyOutlined, path: "/admin/roles" },
    { title: "Thống kê", icon: FundProjectionScreenOutlined, path: "/admin/chart" },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white w-72 p-4 fixed top-0 left-0 h-full shadow-lg flex flex-col">
      <h2
        className="text-2xl font-bold mb-6 text-center cursor-pointer"
        onClick={() => router.push("/admin")}
      >
        Admin JobHuntly
      </h2>
      
      <ul className="space-y-4 flex-grow">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => router.push(item.path)} 
              className="flex items-center space-x-2 hover:bg-blue-700 p-2 rounded-lg transition duration-200 w-full"
            >
              <item.icon className="text-xl" />
              <span className="text-lg">{item.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-700 p-2 rounded-lg transition duration-200 w-full"
        >
          <LogoutOutlined className="text-xl" />
          <span className="text-lg">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

AdminSidebar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default AdminSidebar;
