"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import RelatedJobs from "@/app/Components/Client/RelatedJobs/page";
import CompanyDetail from "@/app/Components/Client/CompanyDetail/page";
import CompanyJobs from "@/app/Components/Client/CompanyJobs/page";

export default function JobDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/api/jobposts/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job details");
        return res.json();
      })
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );

  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;

  if (!job)
    return <p className="text-center text-gray-500">Job not found</p>;

  const handleApply = () => {
    router.push(`/apply/${id}`);
  };

  return (
    <>
      <div className="container mx-auto max-w-4xl">
        {job.company_id && <CompanyDetail companyId={job.company_id} />}
      </div>
      <div className="container mt-4 mx-auto p-6 max-w-4xl bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{job.title}</h1>
        <div className="space-y-3 text-gray-700">
          <p><strong>📍 Địa điểm: </strong> {job.location}</p>
          <p><strong>💼 Loại công việc: </strong> {job.job_type.replace("_", " ")}</p>
          <p><strong>💰 Mức lương: </strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.salary_min)} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.salary_max)}</p>
          <p><strong>📄 Mô tả công việc: </strong> {job.description}</p>
          <p><strong>✅ Yêu cầu: </strong> {job.requirements}</p>
          <p><strong>🎁 Quyền lợi: </strong> {job.benefits}</p>
          <p><strong>⏳ Hạn nộp hồ sơ: </strong> {new Date(job.deadline).toLocaleDateString()}</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            📝 Apply Job
          </button>
        </div>
      </div>
      <div className="container mx-auto max-w-4xl">
        {job.company_id && <CompanyJobs companyId={job.company_id} currentJobId={job.id} />}
        {job.category_id && <RelatedJobs categoryId={job.category_id} currentJobId={job.id} />}
      </div>
    </>
  );
}
