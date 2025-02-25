"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExploreByCategory from "../Category/page";
import { FaSpinner } from "react-icons/fa";

interface Job {
  id: number;
  title: string;
  location: string;
  job_type: string;
  salary_range: string;
  description: string;
  requirements: string;
  benefits: string;
  deadline: string;
}

interface Company {
  id: number;
  name: string;
  address: string;
  description: string;
  phone: string;
  website: string;
  established_date: string;
  email: string;
  employees: number;
}

interface Category {
  id: number;
  name: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    salary: "",
    experience: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes, categoriesRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/jobposts/"),
          fetch("http://127.0.0.1:8000/api/company/"),
          fetch("http://127.0.0.1:8000/api/categories/"),
        ]);

        if (!jobsRes.ok || !companiesRes.ok || !categoriesRes.ok) {
          throw new Error("Lỗi khi lấy dữ liệu");
        }

        const [jobsData, companiesData, categoriesData] = await Promise.all([
          jobsRes.json(),
          companiesRes.json(),
          categoriesRes.json(),
        ]);

        setJobs(jobsData);
        setCompanies(companiesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
    (!filters.location || job.location.includes(filters.location)) &&
    (!filters.category || job.job_type === filters.category) &&
    (!filters.salary || Number(job.salary_range.split(" - ")[0]) >= Number(filters.salary))
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col space-y-10">
      <div className="container mx-auto mt-2">
        <div className="bg-white shadow-md rounded p-4 flex flex-wrap items-center gap-4">
          <input
            type="text"
            name="keyword"
            placeholder="Nhập từ khóa (VD: Lập trình viên, Thiết kế...)"
            value={filters.keyword}
            onChange={handleFilterChange}
            className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả địa điểm</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
          <input
            type="number"
            name="salary"
            placeholder="Mức lương tối thiểu (triệu VNĐ)"
            value={filters.salary}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700">
            Tìm kiếm
          </button>
        </div>
      </div>

      <ExploreByCategory />

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      ) : (
        <>
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold">Danh sách công việc</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-2 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
                  onClick={() => router.push(`/client/job/${job.id}`)}
                >
                  <h3 className="text-lg font-semibold text-blue-600">{job.title}</h3>
                  <p className="text-gray-500">{job.location}</p>
                  <p className="text-green-600 font-semibold">
                    {job.salary_range
                      .split(" - ")
                      .map((salary) =>
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(salary))
                      )
                      .join(" - ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="container mx-auto">
            <h2 className="text-2xl font-bold">Danh sách công ty</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white p-2 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
                  onClick={() => router.push(`/client/company/${company.id}`)}
                >
                  <h3 className="text-lg font-semibold text-blue-600">{company.name}</h3>
                  <p className="text-gray-500">{company.address}</p>
                  <p className="text-gray-600">Nhân viên: {company.employees}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
