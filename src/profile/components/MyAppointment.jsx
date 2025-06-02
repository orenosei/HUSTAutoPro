import React, { useState, useEffect } from 'react';
import * as Service from '@/Shared/Service';
import { useUser } from '@clerk/clerk-react';
import { Table, Tag, Button, Modal, Form, Input, message, Badge, Avatar } from 'antd';
import dayjs from 'dayjs';
import { FaCar, FaUser, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserAndAppointments = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const dbUser = await Service.GetUserByClerkId(user.id);
        if (!dbUser) {
          message.error('Không tìm thấy người dùng');
          return;
        }
        setCurrentUserId(dbUser.id);
        const data = await Service.GetUserAppointments(dbUser.id);
        setAppointments(data);
      } catch (error) {
        console.error('Error loading appointments:', error);
        message.error('Lỗi tải lịch hẹn');
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndAppointments();
  }, [user]);

  const handleAccept = async (appointmentId) => {
    try {
      await Service.UpdateAppointmentStatus(appointmentId, 'accepted');
      message.success('Đã chấp nhận lịch hẹn');
      refreshAppointments();
    } catch (error) {
      message.error('Lỗi khi chấp nhận');
    }
  };

  const handleReject = (appointment) => {
    setSelectedAppointment(appointment);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedAppointment) return;
    try {
      await Service.UpdateAppointmentStatus(selectedAppointment.id, 'rejected', rejectReason);
      message.success('Đã từ chối lịch hẹn');
      setRejectModalVisible(false);
      setRejectReason('');
      refreshAppointments();
    } catch (error) {
      message.error('Lỗi khi từ chối');
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await Service.UpdateAppointmentStatus(appointmentId, 'cancelled');
      message.success('Đã hủy lịch hẹn');
      refreshAppointments();
    } catch (error) {
      message.error('Lỗi khi hủy');
    }
  };

  const refreshAppointments = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const data = await Service.GetUserAppointments(currentUserId);
      setAppointments(data);
    } catch (error) {
      console.error('Error refreshing appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'processing', text: 'Chờ xác nhận' },
      accepted: { color: 'success', text: 'Đã chấp nhận' },
      rejected: { color: 'error', text: 'Đã từ chối' },
      cancelled: { color: 'default', text: 'Đã hủy' }
    };
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Badge status={statusInfo.color} text={statusInfo.text} />;
  };

  const columns = [
    {
      title: 'Loại',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'buyer' ? 'blue' : 'green'}>
          {role === 'buyer' ? 'Bạn đặt xem' : 'Người khác đặt'}
        </Tag>
      ),
      width: 120,
    },
    {
      title: 'Xe',
      dataIndex: 'carTitle',
      key: 'carTitle',
      render: (text, record) => (
        <div className="flex items-center">
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Người liên quan',
      key: 'party',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            size="small" 
            src={record.role === 'buyer' ? record.owner?.avatar : record.buyer?.avatar}
            className="mr-2"
          >
            <FaUser />
          </Avatar>
          {record.role === 'buyer' 
            ? `${record.owner?.firstName || ''} ${record.owner?.lastName || ''}` 
            : `${record.buyer?.firstName || ''} ${record.buyer?.lastName || ''}`}
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      render: (time) => (
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          {dayjs(time).format('DD/MM/YYYY HH:mm')}
        </div>
      ),
    },

    {
        title: 'Ghi chú',
        dataIndex: 'notes',
        key: 'notes',
        render: (text) => (
          <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
            {text || 'Không có ghi chú'}
          </div>
        ),
        width: 200,
        ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        // Lịch hẹn do người khác đặt (mình là chủ xe)
        if (record.role === 'seller' && record.status === 'pending') {
          return (
            <div className="flex space-x-2">
              <Button 
                type="primary" 
                icon={<FaCheck />} 
                size="small"
                onClick={() => handleAccept(record.id)}
              >
                Chấp nhận
              </Button>
              <Button 
                danger 
                icon={<FaTimes />} 
                size="small"
                onClick={() => handleReject(record)}
              >
                Từ chối
              </Button>
            </div>
          );
        }
        
        // Lịch hẹn do mình đặt (với trạng thái chờ xác nhận)
        if (record.role === 'buyer' && record.status === 'pending') {
          return (
            <Button 
              danger 
              size="small"
              onClick={() => handleCancel(record.id)}
            >
              Hủy lịch
            </Button>
          );
        }
        
        return null;
      },
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
    <div className="flex justify-between items-center mb-6 w-full">
        <h2 className="text-2xl font-bold">Lịch hẹn xem xe</h2>
        <Button 
            type="primary" 
            onClick={refreshAppointments}
            loading={loading}
        >
            Làm mới
        </Button>
    </div>
    
    {/* Wrap the Table in a responsive container */}
    <div className="overflow-x-auto">
        <Table 
            columns={columns} 
            className='rounded-lg w-full'
            dataSource={appointments} 
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
        />
    </div>
      
      <Modal
        title="Lý do từ chối"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setRejectModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="danger" onClick={handleRejectConfirm}>
            Xác nhận từ chối
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Lý do từ chối" required>
            <Input.TextArea 
              rows={4} 
              value={rejectReason} 
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Vui lòng nhập lý do từ chối lịch hẹn..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyAppointment;