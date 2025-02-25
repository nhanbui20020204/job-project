"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function JobDetail() {
  const { id } = useParams();
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

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!job) return <p className="text-center text-gray-500">Job not found</p>;

  return (
    <div className="container mt-4 mx-auto p-6 max-w-2xl bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{job.title}</h1>

      <div className="space-y-3 text-gray-700">
        <p>
          <strong className="font-semibold">📍 Địa điểm:</strong> {job.location}
        </p>
        <p>
          <strong className="font-semibold">💼 Loại công việc:</strong> {job.job_type.replace("_", " ")}
        </p>
        <p>
          <strong className="font-semibold">💰 Mức lương:</strong> {job.salary_range} VND
        </p>
        <p>
          <strong className="font-semibold">📄 Mô tả công việc:</strong> {job.description}
        </p>
        <p>
          <strong className="font-semibold">✅ Yêu cầu:</strong> {job.requirements}
        </p>
        <p>
          <strong className="font-semibold">🎁 Quyền lợi:</strong> {job.benefits}
        </p>
        <p>
          <strong className="font-semibold">⏳ Hạn nộp hồ sơ:</strong>{" "}
          {new Date(job.deadline).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
