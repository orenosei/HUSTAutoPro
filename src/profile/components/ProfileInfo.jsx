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
    address: "",
    province: "",
    district: "",
    ward: ""
  })

  // State cho danh sách địa chỉ
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  // Fetch danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/')
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error)
      }
    }
    fetchProvinces()
  }, [])

  // Fetch danh sách quận/huyện khi tỉnh thay đổi
  useEffect(() => {
    const fetchDistricts = async () => {
      if (form.province) {
        try {
          const response = await fetch(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
          const data = await response.json()
          setDistricts(data.districts)
        } catch (error) {
          console.error("Lỗi khi lấy danh sách quận huyện:", error)
        }
      } else {
        setDistricts([])
      }
      // Reset quận/huyện và phường/xã khi tỉnh thay đổi
      setForm(prev => ({ ...prev, district: "", ward: "" }))
      setWards([])
    }
    fetchDistricts()
  }, [form.province])

  // Fetch danh sách phường/xã khi quận/huyện thay đổi
  useEffect(() => {
    const fetchWards = async () => {
      if (form.district) {
        try {
          const response = await fetch(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
          const data = await response.json()
          setWards(data.wards)
        } catch (error) {
          console.error("Lỗi khi lấy danh sách phường xã:", error)
        }
      } else {
        setWards([])
      }
      // Reset phường/xã khi quận/huyện thay đổi
      setForm(prev => ({ ...prev, ward: "" }))
    }
    fetchWards()
  }, [form.district])

  // Tải dữ liệu người dùng
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      const foundUser = await Service.GetUserByClerkId(user.id)
      if (foundUser) {
        // Phân tích địa chỉ nếu có
        const addressParts = foundUser.address?.split(', ') || []
        const newForm = {
          firstName: foundUser.firstName || "",
          lastName: foundUser.lastName || "",
          phoneNumber: foundUser.phoneNumber || "",
          address: addressParts[0] || "", // Địa chỉ chi tiết
          province: foundUser.province || "",
          district: foundUser.district || "",
          ward: foundUser.ward || ""
        }
        setForm(newForm)
      }
    }
    fetchData()
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!user) return
    
    // Ghép địa chỉ đầy đủ
    const provinceName = provinces.find(p => p.code === form.province)?.name || ""
    const districtName = districts.find(d => d.code === form.district)?.name || ""
    const wardName = wards.find(w => w.code === form.ward)?.name || ""
    
    const fullAddress = [
      form.address,
      wardName,
      districtName,
      provinceName
    ].filter(Boolean).join(', ')

    const foundUser = await Service.GetUserByClerkId(user.id)
    if (foundUser) {
      await Service.UpdateUserProfile(foundUser.id, {
        ...form,
        address: fullAddress,
        province: form.province,
        district: form.district,
        ward: form.ward
      })
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

          {/* Phần địa chỉ mới */}
          <div>
            <label className="block text-gray-700 mb-1">Địa chỉ chi tiết:</label>
            <Input
              name="address"
              placeholder="Số nhà, đường, ngõ..."
              value={form.address}
              onChange={handleChange}
              className="border-2 rounded-xl p-3 border-blue-100 hover:shadow-md cursor-pointer hover:scale-101 transition-transform"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Tỉnh/Thành phố:</label>
              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                className="w-full border-2 rounded-xl p-3 border-blue-100 hover:shadow-md cursor-pointer hover:scale-101 transition-transform"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map(province => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Quận/Huyện:</label>
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                disabled={!form.province}
                className="w-full border-2 rounded-xl p-3 border-blue-100 hover:shadow-md cursor-pointer hover:scale-101 transition-transform disabled:opacity-50"
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map(district => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phường/Xã:</label>
              <select
                name="ward"
                value={form.ward}
                onChange={handleChange}
                disabled={!form.district}
                className="w-full border-2 rounded-xl p-3 border-blue-100 hover:shadow-md cursor-pointer hover:scale-101 transition-transform disabled:opacity-50"
              >
                <option value="">Chọn phường/xã</option>
                {wards.map(ward => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
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