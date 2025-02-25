"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Input, notification, DatePicker, Checkbox, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";

interface Category {
  id: number;
  name: string;
  description: string;
  created_date: string;
  updated_date: string;
  active: boolean;
}
interface Subcategory {
  id: number;
  name: string;
  description: string;
  category: number;
  active: boolean;
}

const JobManagementPage = () => {
  const [isAddSubcategoryModalVisible, setIsAddSubcategoryModalVisible] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({ name: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [isRequirementModalVisible, setIsRequirementModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    job_type: "full_time",
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: "",
    benefits: "",
    deadline: "",
    active: true,
    company_id: "",
    category_id: "",
    subcategory_id: "",
  });

  const handleChange = (key, value) => {
    setJobData({ ...jobData, [key]: value });
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/jobposts/");
      if (!response.ok) {
        throw new Error("Không thể tải Công Việc từ server");
      }
      const data = await response.json();
      console.log("Công Việc",data);
      setCategories(data);
    } catch (error) {
      setError("Lỗi khi tải Công Việc");
      notification.error({ message: "Lỗi", description: "Không thể tải Công Việc" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/jobposts/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Không thể xóa Công Việc");
      }
      notification.success({ message: "Xóa thành công", description: "Công Việc đã được xóa." });
      fetchCategories();
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa Công Việc", description: "Không thể xóa Công Việc" });
    }
  };

  const handleSave = async () => {
    if (currentCategory) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/jobposts/${currentCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentCategory),
        });
        if (!response.ok) {
          throw new Error("Không thể cập nhật Công Việc");
        }
        notification.success({ message: "Cập nhật thành công", description: "Công Việc đã được cập nhật." });
        setIsModalVisible(false);
        fetchCategories();
      } catch (error) {
        notification.error({ message: "Lỗi khi cập nhật Công Việc", description: "Không thể cập nhật Công Việc" });
      }
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/jobposts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        throw new Error("Không thể thêm Công Việc");
      }
      notification.success({ message: "Thêm Công Việc thành công", description: "Công Việc đã được thêm." });
      setIsAddModal(false);
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      notification.error({ message: "Lỗi khi thêm Công Việc", description: "Không thể thêm Công Việc" });
    }
  };
  const showDescriptionModal = (job) => {
    setSelectedJob(job);
    setIsDescriptionModalVisible(true);
  };

  const showRequirementModal = (job) => {
    setSelectedJob(job);
    setIsRequirementModalVisible(true);
  };
  return (
    <div className="p-4 ml-72">
      <div className="flex justify-between items-center mb-4 mt-5">
        <h1 className="text-3xl font-bold">Quản Lý Tin Tuyển Dụng</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModal(true)}
          className="h-12 text-xl bg-green-500 py-4 px-8 rounded-lg"
        >
          Thêm Công Việc
        </Button>
      </div>
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto w-full border-collapse border border-gray-300 text-center mt-10">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Tin Tuyển Dụng</th>
            <th className="border border-gray-300 px-4 py-2">Nơi Làm Việc</th>
            <th className="border border-gray-300 px-4 py-2">TIền Lương</th>
            <th className="border border-gray-300 px-4 py-2">Loại Việc Làm</th>
            <th className="border border-gray-300 px-4 py-2">Mô Tả</th>
            <th className="border border-gray-300 px-4 py-2">Yêu Cầu Công Việc</th>
            <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
            <th className="border border-gray-300 px-4 py-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{category.id}</td>
              <td className="border border-gray-300 px-4 py-2">{category.title}</td>
              <td className="border border-gray-300 px-4 py-2">{category.location}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(category.salary_min)} - {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(category.salary_max)}
              </td>
              <td className="border border-gray-300 px-4 py-2">{category.job_type}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Button icon={<UnorderedListOutlined />} onClick={() => showDescriptionModal(category)} className="bg-yellow-400">
                  Mô Tả
                </Button>
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <Button icon={<UnorderedListOutlined />} onClick={() => showRequirementModal(category)} className="bg-blue-400">
                  Yêu Cầu
                </Button>
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {category.active == true ? "Hoạt động" : "Tạm dừng"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(category)}
                  className="mr-2 bg-blue-500"
                  size="small"
                >
                  Sửa
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(category.id)}
                  size="small"
                  className="bg-red-500"
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        title="Chỉnh Sửa Công Việc"
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={currentCategory?.name || ""}
          onChange={(e) => setCurrentCategory({ ...currentCategory!, name: e.target.value })}
          placeholder="Tên Công Việc"
        />
        <Input
          value={currentCategory?.description || ""}
          onChange={(e) => setCurrentCategory({ ...currentCategory!, description: e.target.value })}
          placeholder="Mô tả"
          className="mt-2"
        />
      </Modal>
    <Modal
      title="Thêm Công Việc"
      open={isAddModal}
      onOk={() => handleAddJob(jobData)}
      onCancel={() => setIsAddModal(false)}
      width={720}
    >
      <Input
        value={jobData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Tiêu đề công việc"
      />
      <Input
        value={jobData.location}
        onChange={(e) => handleChange("location", e.target.value)}
        placeholder="Địa điểm"
        className="mt-2"
      />
      <Select
        value={jobData.job_type}
        onChange={(value) => handleChange("job_type", value)}
        className="mt-2 w-full"
        options={[
          { value: "full_time", label: "Full-time" },
          { value: "part_time", label: "Part-time" },
          { value: "contract", label: "Thỏa Thuận" },
        ]}
      />
      <Input
        type="number"
        value={jobData.salary_min}
        onChange={(e) => handleChange("salary_min", e.target.value)}
        placeholder="Lương tối thiểu"
        className="mt-2"
      />
      <Input
        type="number"
        value={jobData.salary_max}
        onChange={(e) => handleChange("salary_max", e.target.value)}
        placeholder="Lương tối đa"
        className="mt-2"
      />
      <Input.TextArea
        value={jobData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Mô tả công việc"
        className="mt-2"
      />
      <Input.TextArea
        value={jobData.requirements}
        onChange={(e) => handleChange("requirements", e.target.value)}
        placeholder="Yêu cầu công việc"
        className="mt-2"
      />
      <Input.TextArea
        value={jobData.benefits}
        onChange={(e) => handleChange("benefits", e.target.value)}
        placeholder="Quyền lợi"
        className="mt-2"
      />
      <DatePicker
        value={jobData.deadline}
        onChange={(date, dateString) => handleChange("deadline", dateString)}
        placeholder="Hạn nộp hồ sơ"
        className="mt-2 w-full"
      />
      <Input
        type="number"
        value={jobData.company_id}
        onChange={(e) => handleChange("company_id", e.target.value)}
        placeholder="ID công ty"
        className="mt-2"  
      />
      <Input
        type="number"
        value={jobData.category_id}
        onChange={(e) => handleChange("category_id", e.target.value)}
        placeholder="ID danh mục"
        className="mt-2"
      />
      <Input
        type="number"
        value={jobData.subcategory_id}
        onChange={(e) => handleChange("subcategory_id", e.target.value)}
        placeholder="ID danh mục con"
        className="mt-2"
      />
    </Modal>
      <Modal
        title="Mô Tả Công Việc"
        open={isDescriptionModalVisible}
        onCancel={() => setIsDescriptionModalVisible(false)}
        footer={null}
      >
        <p className="text-lg font-bold">Mô Tả:</p>
        <p className="text-lg">{selectedJob?.description}</p>
        <p className="text-lg font-bold">Đãi Ngộ:</p>
        <p className="text-lg">{selectedJob?.benefits}</p>
      </Modal>
      <Modal
        title="Yêu Cầu Công Việc"
        open={isRequirementModalVisible}
        onCancel={() => setIsRequirementModalVisible(false)}
        footer={null}
      >
        <p className="text-lg">{selectedJob?.requirements}</p>
      </Modal>
    </div>
  );
};

export default JobManagementPage;
