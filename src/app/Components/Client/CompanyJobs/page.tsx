"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaMoneyBillWave, FaSpinner } from "react-icons/fa";

interface Job {
  id: number;
  title: string;
  location: string;
  salary_min: number;
  salary_max: number;
}

interface CompanyJobsProps {
  companyId: number;
  currentJobId: number;
}

export default function CompanyJobs({ companyId, currentJobId }: CompanyJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!companyId) return;

    fetch(`http://127.0.0.1:8000/api/jobposts/company/${companyId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch company jobs");
        return res.json();
      })
      .then((data: Job[]) => {
        const filteredJobs = data.filter((job) => job.id !== currentJobId);
        setJobs(filteredJobs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [companyId, currentJobId]);

  if (loading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <FaSpinner className="animate-spin text-lg text-blue-500" />
        <span className="ml-2 text-lg text-blue-500">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Lỗi: {error}</p>;
  }

  if (jobs.length === 0) {
    return <p className="text-center text-gray-500">Không có công việc khác trong công ty.</p>;
  }

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        🔍 Công việc khác tại công ty
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => router.push(`/client/job/${job.id}`)}
            className="relative cursor-pointer rounded-lg border border-gray-200 bg-white p-5 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-800 hover:text-blue-600">
              {job.title}
            </h3>
            <p className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-blue-500" /> {job.location}
            </p>
            <p className="mt-1 flex items-center font-medium text-gray-700">
              <FaMoneyBillWave className="mr-2 text-green-500" />
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(job.salary_min)}{" "}
              -{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(job.salary_max)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}