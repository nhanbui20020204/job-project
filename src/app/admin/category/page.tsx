"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Input, notification } from "antd";
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

const CategoryManagementPage = () => {
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

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories/");
      if (!response.ok) {
        throw new Error("Không thể tải danh mục từ server");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError("Lỗi khi tải danh mục");
      notification.error({ message: "Lỗi", description: "Không thể tải danh mục" });
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
      const response = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Không thể xóa danh mục");
      }
      notification.success({ message: "Xóa thành công", description: "Danh mục đã được xóa." });
      fetchCategories();
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa danh mục", description: "Không thể xóa danh mục" });
    }
  };

  const handleSave = async () => {
    if (currentCategory) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/categories/${currentCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentCategory),
        });
        if (!response.ok) {
          throw new Error("Không thể cập nhật danh mục");
        }
        notification.success({ message: "Cập nhật thành công", description: "Danh mục đã được cập nhật." });
        setIsModalVisible(false);
        fetchCategories();
      } catch (error) {
        notification.error({ message: "Lỗi khi cập nhật danh mục", description: "Không thể cập nhật danh mục" });
      }
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        throw new Error("Không thể thêm danh mục");
      }
      notification.success({ message: "Thêm danh mục thành công", description: "Danh mục đã được thêm." });
      setIsAddModal(false);
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      notification.error({ message: "Lỗi khi thêm danh mục", description: "Không thể thêm danh mục" });
    }
  };
  const fetchSubcategories = async (categoryId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/subcategories/${categoryId}/`);
      if (!response.ok) throw new Error("Không thể tải thể loại con");
      const data = await response.json();
      setSubcategories(data);
      setIsSubcategoryModalVisible(true);
    } catch (error) {
      notification.error({ message: "Lỗi", description: "Không thể tải thể loại con" });
    }
  };
  const handleAddSubcategory = () => {
    console.log("Thêm danh mục con:", newSubcategory);
    setIsAddSubcategoryModalVisible(false);
    // setNewSubcategory({ name: "", description: "" });
  };
  const showAddSubcategoryModal = () => {
    setIsAddSubcategoryModalVisible(true);
  };
  const handleCancel = () => {
    setIsAddSubcategoryModalVisible(false);
  };


  return (
    <div className="p-4 ml-72">
      <div className="flex justify-between items-center mb-4 mt-5">
        <h1 className="text-3xl font-bold">Quản Lý Danh Mục</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModal(true)}
          className="h-12 text-xl bg-green-500 py-4 px-8 rounded-lg"
        >
          Thêm Danh Mục
        </Button>
      </div>
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto w-full border-collapse border border-gray-300 text-center mt-10">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Tên Danh Mục</th>
            <th className="border border-gray-300 px-4 py-2">Mô Tả</th>
            <th className="border border-gray-300 px-4 py-2">Thể Loại Con</th>
            <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
            <th className="border border-gray-300 px-4 py-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{category.id}</td>
              <td className="border border-gray-300 px-4 py-2">{category.name}</td>
              <td className="border border-gray-300 px-4 py-2">{category.description}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Button icon={<UnorderedListOutlined />} onClick={() => fetchSubcategories(category.id)} className="bg-yellow-400">
                  Danh Mục Con
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
        title="Chỉnh Sửa Danh Mục"
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={currentCategory?.name || ""}
          onChange={(e) => setCurrentCategory({ ...currentCategory!, name: e.target.value })}
          placeholder="Tên danh mục"
        />
        <Input
          value={currentCategory?.description || ""}
          onChange={(e) => setCurrentCategory({ ...currentCategory!, description: e.target.value })}
          placeholder="Mô tả"
          className="mt-2"
        />
      </Modal>

      <Modal
        title="Thêm Danh Mục"
        open={isAddModal}
        onOk={handleAddCategory}
        onCancel={() => setIsAddModal(false)}
      >
        <Input
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          placeholder="Tên danh mục"
        />
        <Input
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          placeholder="Mô tả"
          className="mt-2"
        />
      </Modal>
      <Modal
  title="Thêm Danh Mục Con"
  open={isAddSubcategoryModalVisible}
  onOk={handleAddSubcategory}
  onCancel={() => setIsAddSubcategoryModalVisible(false)}
>
  <Input
    value={newSubcategory?.name || ""}
    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
    placeholder="Tên danh mục con"
  />
  <Input
    value={newSubcategory.description}
    onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
    placeholder="Mô tả"
    className="mt-2"
  />
</Modal>

<Modal
  title={(
    <div className="flex justify-between items-center">
      <span>Danh Mục Con</span>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsAddSubcategoryModalVisible(true)}
        className="bg-green-500 mr-5"
      >
        Thêm danh mục con
      </Button>
    </div>
  )}
  open={isSubcategoryModalVisible}
  onCancel={() => setIsSubcategoryModalVisible(false)}
  footer={null}
  width={800}
>
  <table className="table-auto w-full border-collapse border border-gray-300 text-center mt-2">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 px-4 py-2">ID</th>
        <th className="border border-gray-300 px-4 py-2">Tên Danh Mục Con</th>
        <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
        <th className="border border-gray-300 px-4 py-2">Hành Động</th>
      </tr>
    </thead>
    <tbody>
      {subcategories.map((sub) => (
        <tr key={sub.id} className="hover:bg-gray-100">
          <td className="border border-gray-300 px-4 py-2">{sub.id}</td>
          <td className="border border-gray-300 px-4 py-2">{sub.name}</td>
          <td className="border border-gray-300 px-4 py-2">{sub.active ? "Hoạt động" : "Tạm dừng"}</td>
          <td className="border border-gray-300 px-4 py-2">
            <Button
              icon={<EditOutlined />}
              className="mr-2 bg-blue-500"
              size="small"
              // onClick={() => handleEditSubcategory(sub)} 
            >
              Sửa
            </Button>
            <Button
              icon={<DeleteOutlined />}
              size="small"
              className="bg-red-500"
              // onClick={() => handleDeleteSubcategory(sub.id)} 
            >
              Xóa
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</Modal>

    </div>
  );
};

export default CategoryManagementPage;
