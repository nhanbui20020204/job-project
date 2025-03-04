"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

const API_URL_COMPANY = "http://127.0.0.1:8000/api/company/";

interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  address: string;
  email: string;
}

interface CompanyDetailProps {
  companyId: number;
}

export default function CompanyDetail({ companyId }: CompanyDetailProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL_COMPANY}${companyId}/`);
        if (!response.ok) throw new Error("Failed to fetch company details");
        
        const data: Company = await response.json();
        setCompany(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (loading)
    return (
      <div className="flex items-center justify-center text-gray-600">
        <FaSpinner className="animate-spin text-xl" />
        <span className="ml-2">Loading company details...</span>
      </div>
    );
  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;
  if (!company)
    return <p className="text-center text-gray-500">Company not found</p>;

  return (
    <div 
      className="p-6 bg-white shadow-md rounded-lg mx-auto cursor-pointer"
      onClick={() => router.push(`/client/company/${company?.id}`)}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h2>
      <p className="text-gray-600 mb-4">{company.description}</p>
      <div className="text-gray-500 space-y-1">
        <p>📍 <span className="font-medium">Address:</span> {company.address}</p>
        <p>📧 <span className="font-medium">Email:</span> {company.email}</p>
      </div>
    </div>
  );
}
