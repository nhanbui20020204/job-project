"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { FaSpinner } from "react-icons/fa";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/company/');
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu");
        const data = await response.json();
        const companiesWithCategories = data.map((company) => ({
          ...company,
          jobCategories: ["Software Engineer", "Frontend Developer"], 
        }));

        setCompanies(companiesWithCategories);
        setFilteredCompanies(companiesWithCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    filterCompanies(e.target.value, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    filterCompanies(selectedLocation, e.target.value);
  };

  const filterCompanies = (location, category) => {
    let filtered = companies;

    if (location !== "All") {
      filtered = filtered.filter((company) => company.address.includes(location));
    }
    if (category !== "All") {
      filtered = filtered.filter((company) => company.jobCategories.includes(category));
    }

    setFilteredCompanies(filtered);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between space-x-2">
        <div className="w-1/2">
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="w-full  p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Locations</option>
            <option value="Hanoi">Hanoi</option>
            <option value="Ho Chi Minh City">Ho Chi Minh City</option>
            <option value="Da Nang">Da Nang</option>
          </select>
        </div>

        <div className="w-1/2">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full  p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Categories</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Marketing Specialist">Marketing Specialist</option>
            <option value="Graphic Designer">Graphic Designer</option>
            <option value="Content Writer">Content Writer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Cloud Engineer">Cloud Engineer</option>
            <option value="Web Developer">Web Developer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Fullstack Developer">Fullstack Developer</option>
            <option value="Scrum Master">Scrum Master</option>
            <option value="Project Manager">Project Manager</option>
            <option value="SEO Specialist">SEO Specialist</option>
            <option value="Social Media Manager">Social Media Manager</option>
            <option value="Blockchain Developer">Blockchain Developer</option>
            <option value="AI Engineer">AI Engineer</option>
            <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
          </select>
        </div>
      </div>

      {/* Danh sách công ty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            onClick={() => router.push(`/client/company/${company.id}`)}
          >
            <h3 className="text-2xl font-semibold text-indigo-600 mb-2">
              {company.name}
            </h3>
            <p className="text-gray-500 text-sm mb-4">{company.address}</p>
            <div className="font-medium text-gray-800">
              <p className="text-lg mb-2">Job Categories:</p>
              <ul className="list-disc list-inside">
                {company.jobCategories.map((category, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
