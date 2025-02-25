"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/api/company/${id}/`)
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

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!company) return <p className="text-center text-gray-500">Company not found</p>;

  return (
    <div className="container mt-4 mx-auto p-6 max-w-2xl bg-white shadow-md rounded-lg">
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
    </div>
  );
}
