'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { notification, Modal, Button, Input, Form, Checkbox } from 'antd';

interface User {
  id: number;
  full_name: string;
  username: string;
  first_name: string;
  avatar: string | null;
  skills: string;
  address: string;
  email: string;
  phone: string;
  birthday: string;
  is_staff: boolean;
  is_active: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const apiUrl = 'http://127.0.0.1:8000/api/user/';

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get<User[]>(apiUrl);
      setUsers(response.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  // Toggle user active status
  const toggleActiveStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/user/${id}/update_status/`,
        {
          is_active: !isActive,
        }
      );
      notification.success({
        message: 'Thành công',
        description: `Người dùng ${!isActive ? 'đã kích hoạt' : 'đã tạm dừng'} thành công.`,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_active: !isActive } : user
        )
      );
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật trạng thái người dùng!',
      });
    }
  };

  // Add user
  const handleAddUser = async (values: any) => {
    try {
      const response = await axios.post(apiUrl, values);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm người dùng mới.',
      });
      setIsModalVisible(false);
      form.resetFields(); // Reset form after successful submission
      fetchUsers();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi thêm người dùng!',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 ml-72">
      <div className="flex justify-between items-center mb-4 mt-5">
        <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="h-12 text-xl bg-yellow-500 hover:bg-yellow-600 py-4 px-8 rounded-lg"
        >
          Thêm Người Dùng
        </Button>
      </div>
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="table-auto w-full border-collapse border border-gray-300 text-center mt-10">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Họ và tên</th>
            <th className="border border-gray-300 px-4 py-2">Kỹ năng</th>
            <th className="border border-gray-300 px-4 py-2">Địa chỉ</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Số điện thoại</th>
            <th className="border border-gray-300 px-4 py-2">Ngày sinh</th>
            <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user.first_name} 
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.skills}</td>
              <td className="border border-gray-300 px-4 py-2">{user.address}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
              <td className="border border-gray-300 px-4 py-2">{user.birthday}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => toggleActiveStatus(user.id, user.is_active)}
                  className={`px-4 py-2 rounded ${
                    user.is_active
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {user.is_active ? 'Hoạt Động' : 'Tạm Dừng'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> 
      <Modal
        title="Thêm Người Dùng Mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddUser}
          initialValues={{
            is_staff: false,
            is_active: true,
          }}
        >
          <Form.Item
            label="Tên "
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Họ "
            name="first_name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kỹ năng"
            name="skills"
            rules={[{ required: true, message: 'Vui lòng nhập kỹ năng!' }]}
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
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Quyền quản trị"
            name="is_staff"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="is_active"
            valuePropName="checked"
          >
            <Checkbox defaultChecked />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Thêm Người Dùng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
