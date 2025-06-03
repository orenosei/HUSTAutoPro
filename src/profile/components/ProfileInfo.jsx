import { useState, useEffect } from "react"
import { useUser } from '@clerk/clerk-react';
import Service from '@/Shared/Service';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';

export default function ProfileInfo() {
  const { user } = useUser()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      const foundUser = await Service.GetUserByClerkId(user.id)
      if (foundUser) {
        setForm({
          firstName: foundUser.firstName || "",
          lastName: foundUser.lastName || "",
          phoneNumber: foundUser.phoneNumber || "",
          address: foundUser.address || ""
        })
      }
    }
    fetchData()
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!user) return
    const foundUser = await Service.GetUserByClerkId(user.id)
    if (foundUser) {
      await Service.UpdateUserProfile(foundUser.id, form)
      toast.success("Cập nhật thông tin thành công!")
    }
  }

  return (
    <div className="flex justify-center pt-20 h-auto">
      <div className="w-1/2 bg-white p-6 rounded-2xl border border-gray-300 shadow-md">
        
        {/* Avatar người dùng */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md transition-transform hover:scale-105"
          />
        </div>

        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-4">Cập nhật thông tin</h2>

        <div className="space-y-4 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Họ:</label>
              <Input
                name="firstName"
                placeholder="Nhập họ"
                value={form.firstName}
                onChange={handleChange}
                className="border-2 rounded-xl p-3 border-blue-100 hover:shadow-md cursor-pointer hover:scale-101 transition-transform"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Tên:</label>
              <Input
                name="lastName"
                placeholder="Nhập tên"
                value={form.lastName}
                onChange={handleChange}
                className="border-2 rounded-xl p-3 border-blue-100 hover:shadow-md cursor-pointer hover:scale-101 transition-transform"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Số điện thoại:</label>
            <Input
              name="phoneNumber"
              placeholder="Nhập số điện thoại"
              value={form.phoneNumber}
              onChange={handleChange}
              className="border-2 rounded-xl p-3 border-blue-100 hover:shadow-md cursor-pointer hover:scale-101 transition-transform"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Địa chỉ:</label>
            <Input
              name="address"
              placeholder="Nhập địa chỉ"
              value={form.address}
              onChange={handleChange}
              className="border-2 rounded-xl p-3 border-blue-100 hover:shadow-md cursor-pointer hover:scale-101 transition-transform"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
        >
          Lưu
        </Button>
      </div>
    </div>
  )
}
