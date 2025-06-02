import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import * as Service from '@/Shared/Service';
import { Form, Input, Button, DatePicker, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import { FaCalendarAlt, FaClock, FaStickyNote } from 'react-icons/fa';
import { toast } from 'sonner'

const Appointment = ({ carListingId, ownerId }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để đặt lịch hẹn');
      return;
    }

    setLoading(true);
    try {
      const dbUser = await Service.GetUserByClerkId(user.id);
      if (!dbUser) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }

      const appointmentData = {
        userId: dbUser.id,
        carListingId,
        scheduledTime: new Date(values.date.format('YYYY-MM-DD') + 'T' + values.time.format('HH:mm:ss')),
        notes: values.notes || '',
        status: 'pending'
      };

      const result = await Service.CreateAppointment(appointmentData);
      if (result.success) {
        message.success('Đặt lịch thành công! Chủ xe sẽ liên hệ xác nhận');
        toast.success('Đặt lịch thành công! Chủ xe sẽ liên hệ xác nhận');
        form.resetFields();
      } else {
        message.error(result.message || 'Đã xảy ra lỗi');
      }
    } catch (error) {
      console.error('Lỗi đặt lịch:', error);
      message.error('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-5">
      <h3 className="text-xl font-semibold mb-4">Đặt lịch xem xe</h3>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          date: dayjs().add(1, 'day'),
          time: dayjs().hour(10).minute(0)
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={
              <div className="flex items-center text-gray-700 font-medium">
                <FaCalendarAlt className="mr-2" />
                Ngày xem xe
              </div>
            }
            name="date"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker 
              format="DD/MM/YYYY" 
              disabledDate={(current) => current && current < dayjs().endOf('day')}
              className="w-full h-10 border-gray-300 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex items-center text-gray-700 font-medium">
                <FaClock className="mr-2" />
                Giờ xem xe
              </div>
            }
            name="time"
            rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
          >
            <TimePicker 
              format="HH:mm" 
              minuteStep={15}
              className="w-full h-10 border-gray-300 rounded-lg"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <div className="flex items-center text-gray-700 font-medium">
              <FaStickyNote className="mr-2" />
              Ghi chú cho chủ xe
            </div>
          }
          name="notes"
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Vui lòng cho biết thông tin liên lạc hoặc yêu cầu đặc biệt..." 
            className="border-gray-300 rounded-lg"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 h-10 font-semibold"
          >
            Đặt lịch ngay
          </Button>
        </Form.Item>
      </Form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p className="flex items-start">
          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-0.5">!</span>
          Sau khi đặt lịch, chủ xe sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận
        </p>
      </div>
    </div>
  );
};

export default Appointment;