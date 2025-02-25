"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  ApartmentOutlined,
  BranchesOutlined,
  KeyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";       
import AdminSidebar from "../Components/admin/AdminSliebar/page";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    usersCount: 0,
    jobsCount: 0,
    companiesCount: 0,
    categoriesCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, companiesRes, categoriesRes, jobpostsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/user/"),
          fetch("http://127.0.0.1:8000/api/company/"),
          fetch("http://127.0.0.1:8000/api/categories/"),
          fetch("http://127.0.0.1:8000/api/jobposts/"),
        ]);

        const usersData = usersRes.ok ? await usersRes.json() : [];
        console.log("Users data:", usersData);
        const companiesData = companiesRes.ok ? await companiesRes.json() : [];
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];
        const jobpostsData = jobpostsRes.ok ? await jobpostsRes.json() : [];

        setStats({
          usersCount: usersData.length || 0,
          jobsCount: jobpostsData.length || 0, 
          companiesCount: companiesData.length || 0,
          categoriesCount: categoriesData.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({
          usersCount: 0,
          jobsCount: 0,
          companiesCount: 0,
          categoriesCount: 0,
        });
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r">
      <AdminSidebar handleLogout={handleLogout} />
      <div className="ml-72 p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Trang Quản Trị
        </h1>
        <div id="stats" className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-700">Báo cáo thống kê</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "Người dùng", count: stats.usersCount, color: "bg-blue-500" },
              { title: "Tin tuyển dụng", count: stats.jobsCount, color: "bg-green-500" },
              { title: "Công ty", count: stats.companiesCount, color: "bg-indigo-500" },
              { title: "Thể loại", count: stats.categoriesCount, color: "bg-purple-500" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${item.color} text-white rounded-lg shadow-lg p-6 flex items-center justify-between`}
              >
                <h3 className="text-xl font-bold">{item.title}</h3>
                <span className="text-3xl font-extrabold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
