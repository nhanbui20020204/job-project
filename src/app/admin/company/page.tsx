'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { notification, Modal, Button, Input, Form } from 'antd';

interface Company {
  id: number;
  name: string;
  logo: string | null;
  address: string;
  description: string;
  phone: string;
  website: string;
  established_date: string;
  email: string;
  employees: number;
  full_description: string;
  status: boolean;
}

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const apiUrl = 'http://127.0.0.1:8000/api/company/';

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Company[]>(apiUrl);
      setCompanies(response.data);
      setError('');
    } catch (err) {
      setError('Lỗi khi tải danh sách công ty!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (values: any) => {
    try {
      await axios.post(apiUrl, values);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm công ty mới.',
      });
      setIsModalVisible(false);
      form.resetFields();
      fetchCompanies();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi thêm công ty!',
      });
    }
  };

  const handleChangeStatus = async (id: number, currentStatus: boolean) => {
    try {
      await axios.post(`${apiUrl}${id}/change_status/`, {
        status: !currentStatus,
      });
      notification.success({
        message: 'Thành công',
        description: `Công ty đã được chuyển sang trạng thái ${
          !currentStatus ? 'Hoạt động' : 'Tạm dừng'
        }.`,
      });
      fetchCompanies();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thay đổi trạng thái công ty!',
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-4 ml-72">
      <div className="flex justify-between items-center mb-4 mt-5">
        <h1 className="text-3xl font-bold">Quản Lý Công Ty</h1>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="h-12 text-xl bg-yellow-500 hover:bg-yellow-600 py-4 px-8 rounded-lg"
        >
          Thêm Công Ty
        </Button>
      </div>
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="table-auto w-full border-collapse border border-gray-300 text-center mt-10">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Tên Công Ty</th>
            <th className="border border-gray-300 px-4 py-2">Địa Chỉ</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="border border-gray-300 px-4 py-2">{company.id}</td>
              <td className="border border-gray-300 px-4 py-2">{company.name}</td>
              <td className="border border-gray-300 px-4 py-2">{company.address}</td>
              <td className="border border-gray-300 px-4 py-2">{company.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleChangeStatus(company.id, company.status)}
                  className={`px-4 py-2 rounded ${
                    company.status
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {company.status ? 'Tạm Dừng' : 'Hoạt Động'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title="Thêm Công Ty Mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddCompany}>
          <Form.Item
            label="Tên Công Ty"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>  
          <Form.Item
            label="Email"
            name="email"  
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Thêm Công Ty
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CompanyManagement;
