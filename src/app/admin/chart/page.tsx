"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StatisticsPage: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<{ [key: string]: { companies: number; jobs: number; users: number } }>({});
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, jobRes, userRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/company/"),
          axios.get("http://127.0.0.1:8000/api/jobposts/"),
          axios.get("http://127.0.0.1:8000/api/user/"),
        ]);

        const processData = (data: any[], key: string) => {
          return data.reduce((acc, item) => {
            const date = new Date(item.created_at);
            const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
            if (!acc[month]) {
              acc[month] = { companies: 0, jobs: 0, users: 0 };
            }
            acc[month][key] += 1;
            return acc;
          }, {} as { [key: string]: { companies: number; jobs: number; users: number } });
        };

        const companyData = processData(companyRes.data, "companies");
        const jobData = processData(jobRes.data, "jobs");
        const userData = processData(userRes.data, "users");

        const combinedData: { [key: string]: { companies: number; jobs: number; users: number } } = {};
        const allMonths = new Set([...Object.keys(companyData), ...Object.keys(jobData), ...Object.keys(userData)]);
        
        allMonths.forEach((month) => {
          combinedData[month] = {
            companies: companyData[month]?.companies || 0,
            jobs: jobData[month]?.jobs || 0,
            users: userData[month]?.users || 0,
          };
        });

        setMonthlyData(combinedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const allMonthsSorted = Object.keys(monthlyData).sort();
  const filteredMonths = allMonthsSorted.filter(month => 
    (!startMonth || month >= startMonth) && (!endMonth || month <= endMonth)
  );

  const data = {
    labels: filteredMonths,
    datasets: [
      {
        label: "Công ty",
        data: filteredMonths.map(month => monthlyData[month]?.companies || 0),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
      {
        label: "Bài đăng",
        data: filteredMonths.map(month => monthlyData[month]?.jobs || 0),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
      {
        label: "Người dùng",
        data: filteredMonths.map(month => monthlyData[month]?.users || 0),
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderColor: "rgb(255, 206, 86)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Thống kê theo tháng</h2>
      <div className="flex justify-center gap-4 mb-4">
        <input 
          type="month" 
          value={startMonth} 
          onChange={(e) => setStartMonth(e.target.value)}
          className="border p-2 rounded"
        />
        <input 
          type="month" 
          value={endMonth} 
          onChange={(e) => setEndMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StatisticsPage;
