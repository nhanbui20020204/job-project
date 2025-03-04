"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

const API_URL_COMPANY = "http://127.0.0.1:8000/api/company/";
const API_URL_JOBS = "http://127.0.0.1:8000/api/jobposts/company/";

function JobList({ companyId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!companyId) return;

    fetch(`${API_URL_JOBS}${companyId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job listings");
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [companyId]);

  if (loading) return <p className="text-center text-gray-600">Loading jobs...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (jobs.length === 0) return <p className="text-center text-gray-500">No jobs available</p>;

  return (
    <div className="mt-6">
      <hr />
      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">Available Jobs</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="p-6 rounded-lg shadow bg-white border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/client/job/${job.id}`)}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
            <p className="text-gray-600 text-base">📍 {job.location} | 💼 {job.job_type}</p>
            <p className="text-gray-700 text-base">💰 {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} VND</p>
            <p className="text-gray-500 text-sm mt-3 line-clamp-2">📝 {job.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL_COMPANY}${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch company details");
        return res.json();
      })
      .then((data) => {
        setCompany(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
      return (
        <div className="flex items-center justify-center text-gray-600">
          <FaSpinner className="animate-spin text-5xl text-blue-500" />
        </div>
      );
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!company) return <p className="text-center text-gray-500">Company not found</p>;

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{company.name}</h1>
      {company.logo && (
        <div className="mb-4 flex justify-center">
          <img src={company.logo} alt={`${company.name} Logo`} className="w-32 h-32 object-contain" />
        </div>
      )}
      <div className="space-y-3 text-gray-700">
        <p>
          <strong className="font-semibold">📍 Địa chỉ:</strong> {company.address}
        </p>
        <p>
          <strong className="font-semibold">📅 Thành lập:</strong> {new Date(company.established_date).toLocaleDateString()}
        </p>
        <p>
          <strong className="font-semibold">👥 Số nhân viên:</strong> {company.employees} người
        </p>
        <p>
          <strong className="font-semibold">📞 Điện thoại:</strong> {company.phone}
        </p>
        <p>
          <strong className="font-semibold">📧 Email:</strong> {company.email}
        </p>
        <p>
          <strong className="font-semibold">🌐 Website:</strong>{" "}
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {company.website}
          </a>
        </p>
        <p>
          <strong className="font-semibold">📝 Mô tả:</strong> {company.description}
        </p>
        <p>
          <strong className="font-semibold">📄 Giới thiệu chi tiết:</strong> {company.full_description}
        </p>
      </div>
      <JobList companyId={id} />
    </div>
  );
}
