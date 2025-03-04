"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000/api/jobposts/";
const API_URL_COMPANY = "http://127.0.0.1:8000/api/company/";

interface Job {
  id: number;
  title: string;
  company_id: number;
  location: string;
  salary_min: number;
  salary_max: number;
  created_date: string;
  category: string;
}

interface Company {
  id: number;
  name: string;
}

interface RelatedJobsProps {
  categoryId: number;
  currentJobId: number;
}

export default function RelatedJobs({ categoryId, currentJobId }: RelatedJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!categoryId) return;

    async function fetchRelatedJobs() {
      try {
        setLoading(true);

        const jobsRes = fetch(`${API_URL}?category=${categoryId}`);
        const companiesRes = fetch(API_URL_COMPANY);

        const [jobsData, companiesData] = await Promise.all([jobsRes, companiesRes]);
        if (!jobsData.ok || !companiesData.ok) throw new Error("Failed to fetch data");

        const jobsJson: Job[] = await jobsData.json();
        const companiesJson: Company[] = await companiesData.json();

        const companyMap: { [key: number]: string } = {};
        companiesJson.forEach((company) => {
          companyMap[company.id] = company.name;
        });

        setJobs(jobsJson.filter((job) => job.id !== currentJobId));
        setCompanies(companyMap);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedJobs();
  }, [categoryId, currentJobId]);   

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (jobs.length === 0) return <p className="text-center text-gray-500">No related jobs found</p>;

  return (
    <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Similar Jobs</h2>
        <button
            className="text-blue-600 hover:underline font-bold"
            onClick={() => router.push("/client/job")}
        >
            Show All Jobs →
        </button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-4 bg-white shadow-md rounded-lg cursor-pointer transition hover:shadow-lg"
            onClick={() => router.push(`/client/job/${job.id}`)}
          >
            <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
            <p className="text-gray-600">{companies[job.company_id] || "Đang tải..."} - {job.location}</p>
            <div className="mt-2 flex gap-2">
              <span className="px-2 py-1  text-yellow-800 text-xs font-medium rounded">Ngày Đăng: {new Date(job.created_date).toLocaleDateString('vi-VN')}</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Full Time</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
