'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { FaSpinner } from 'react-icons/fa'

type Job = {
    id: number
    title: string
    company_id: number
    location: string
    salary_min: number
    salary_max: number
    created_date: string
    category_id: number
    job_type: string
    description: string
    requirements: string
    benefits: string
    deadline: string
}

type Company = {
    id: number
    name: string
    address: string
    description: string
    phone: string
    website: string
    email: string
    employees: number
}

type Category = {
    id: number
    name: string
    description: string
}

const API_URL = 'http://127.0.0.1:8000/api/jobposts/'
const API_URL_CATEGORIES = 'http://127.0.0.1:8000/api/categories/'
const API_URL_COMPANY = 'http://127.0.0.1:8000/api/company/'

const JobList = () => {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([])
    const [companies, setCompanies] = useState<{ [key: number]: Company }>({})
    const [categories, setCategories] = useState<{ [key: number]: Category }>({})
    const [locations, setLocations] = useState<string[]>(['Tất cả địa điểm'])
    const [selectedLocation, setSelectedLocation] = useState<string>('Tất cả địa điểm')
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả danh mục')
    const [jobTypes, setJobTypes] = useState<string[]>(['Tất cả thời gian', 'full_time', 'part_time'])
    const [selectedJobType, setSelectedJobType] = useState<string>('Tất cả thời gian')
    const [salaryRanges] = useState<string[]>(['Tất cả mức lương', 'Dưới 5 triệu', '5 triệu - 10 triệu', '10 triệu - 20 triệu', 'Trên 20 triệu'])
    const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>('Tất cả mức lương')
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(API_URL)
                const data: Job[] = await response.json()
                setJobs(data)
                setLoading(false)
                const uniqueLocations = ['Tất cả địa điểm', ...new Set(data.map(job => job.location))]
                setLocations(uniqueLocations)

                data.forEach(job => {
                    fetchCompany(job.company_id);
                    fetchCategory(job.category_id);
                });
            } catch (error) {
                console.error('Error fetching jobs:', error)
                setLoading(false)
            }
        }

        fetchJobs()
    }, [])

    const fetchCompany = async (companyId: number) => {
        if (companies[companyId]) return;
        try {
            const response = await fetch(`${API_URL_COMPANY}${companyId}/`)
            const data: Company = await response.json()
            setCompanies(prev => ({ ...prev, [companyId]: data }))
        } catch (error) {
            console.error(`Error fetching company ${companyId}:`, error)
        }
    }

    const fetchCategory = async (categoryId: number) => {
        if (categories[categoryId]) return;
        try {
            const response = await fetch(`${API_URL_CATEGORIES}${categoryId}/`)
            const data: Category = await response.json()
            setCategories(prev => ({ ...prev, [categoryId]: data }))
        } catch (error) {
            console.error(`Error fetching category ${categoryId}:`, error)
        }
    }

    const filteredJobs = jobs.filter(job => {
        const salaryFilter =
            selectedSalaryRange === 'Tất cả mức lương' ||
            (selectedSalaryRange === 'Dưới 5 triệu' && job.salary_max < 5000000) ||
            (selectedSalaryRange === '5 triệu - 10 triệu' && job.salary_min >= 5000000 && job.salary_max <= 10000000) ||
            (selectedSalaryRange === '10 triệu - 20 triệu' && job.salary_min >= 10000000 && job.salary_max <= 20000000) ||
            (selectedSalaryRange === 'Trên 20 triệu' && job.salary_min > 20000000);

        return (
            (selectedCategory === 'Tất cả danh mục' || categories[job.category_id]?.name === selectedCategory) &&
            (selectedLocation === 'Tất cả địa điểm' || job.location === selectedLocation) &&
            (selectedJobType === 'Tất cả thời gian' || job.job_type === selectedJobType) &&
            salaryFilter &&
            (searchKeyword === '' || job.title.toLowerCase().includes(searchKeyword.toLowerCase()) || job.description.toLowerCase().includes(searchKeyword.toLowerCase()))
        );
    });

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 flex flex-wrap items-center space-x-2">
                <div className="flex-grow relative">
                    <input
                        type="text"
                        placeholder="Nhập từ khóa (VD: Lập trình viên, Thiết kế...)"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['Tất cả danh mục', ...Object.values(categories).map(c => c.name)].map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>

                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                    ))}
                </select>

                <select value={selectedJobType} onChange={(e) => setSelectedJobType(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {jobTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>

                <select value={selectedSalaryRange} onChange={(e) => setSelectedSalaryRange(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {salaryRanges.map((range, index) => (
                        <option key={index} value={range}>{range}</option>
                    ))}
                </select>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                    Tìm kiếm
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
                </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                    <div 
                        key={job.id} 
                        className="p-4 border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/client/job/${job.id}`)}
                    >   
                        <h3 className="text-2xl font-semibold text-blue-600 mb-2">{job.title}</h3>
                        <p className="text-gray-600 mb-1">
                            {companies[job.company_id]?.name || 'Đang tải...'} - {job.location}
                        </p>
                        <p className="text-lg font-bold text-gray-800 mb-2">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.salary_min)} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(job.salary_max)}
                        </p>
                        <p className="text-sm text-gray-500">
                            Ngày đăng: {new Date(job.created_date).toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}

export default JobList
