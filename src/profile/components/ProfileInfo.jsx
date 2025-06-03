import { useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';
import Service from '@/Shared/Service';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfileInfo() {
  const { user } = useUser();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: {
      detail: "",
      province: null,
      district: null,
      ward: null
    }
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState({
    provinces: true,
    districts: false,
    wards: false
  });

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("Không thể tải danh sách tỉnh thành");
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (form.address.province?.code) {
        setLoading(prev => ({ ...prev, districts: true }));
        try {
          const response = await fetch(`https://provinces.open-api.vn/api/p/${form.address.province.code}?depth=2`);
          const data = await response.json();
          setDistricts(data.districts);
          
          // Reset district and ward
          setForm(prev => ({
            ...prev,
            address: {
              ...prev.address,
              district: null,
              ward: null
            }
          }));
          setWards([]);
        } catch (error) {
          console.error("Error fetching districts:", error);
          toast.error("Không thể tải danh sách quận/huyện");
        } finally {
          setLoading(prev => ({ ...prev, districts: false }));
        }
      } else {
        setDistricts([]);
        setWards([]);
      }
    };

    fetchDistricts();
  }, [form.address.province]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (form.address.district?.code) {
        setLoading(prev => ({ ...prev, wards: true }));
        try {
          const response = await fetch(`https://provinces.open-api.vn/api/d/${form.address.district.code}?depth=2`);
          const data = await response.json();
          setWards(data.wards);
          
          // Reset ward
          setForm(prev => ({
            ...prev,
            address: {
              ...prev.address,
              ward: null
            }
          }));
        } catch (error) {
          console.error("Error fetching wards:", error);
          toast.error("Không thể tải danh sách phường/xã");
        } finally {
          setLoading(prev => ({ ...prev, wards: false }));
        }
      } else {
        setWards([]);
      }
    };

    fetchWards();
  }, [form.address.district]);

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const foundUser = await Service.GetUserByClerkId(user.id);
        if (foundUser) {
          // Handle address conversion
          let addressData = {};
          if (typeof foundUser.address === 'string') {
            addressData = { detail: foundUser.address };
          } else if (foundUser.address) {
            addressData = foundUser.address;
          }
          
          setForm({
            firstName: foundUser.firstName || "",
            lastName: foundUser.lastName || "",
            phoneNumber: foundUser.phoneNumber || "",
            address: {
              detail: addressData.detail || "",
              province: addressData.province || null,
              district: addressData.district || null,
              ward: addressData.ward || null
            }
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Không thể tải thông tin người dùng");
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    setForm({ 
      ...form, 
      [e.target.name]: e.target.value 
    });
  };

  const handleDetailChange = (e) => {
    setForm({
      ...form,
      address: {
        ...form.address,
        detail: e.target.value
      }
    });
  };

  const handleProvinceChange = (value) => {
    const selected = provinces.find(p => p.code === value);
    setForm({
      ...form,
      address: {
        ...form.address,
        province: selected ? { 
          code: selected.code, 
          name: selected.name 
        } : null
      }
    });
  };

  const handleDistrictChange = (value) => {
    const selected = districts.find(d => d.code === value);
    setForm({
      ...form,
      address: {
        ...form.address,
        district: selected ? { 
          code: selected.code, 
          name: selected.name 
        } : null
      }
    });
  };

  const handleWardChange = (value) => {
    const selected = wards.find(w => w.code === value);
    setForm({
      ...form,
      address: {
        ...form.address,
        ward: selected ? { 
          code: selected.code, 
          name: selected.name 
        } : null
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const foundUser = await Service.GetUserByClerkId(user.id);
      if (foundUser) {
        await Service.UpdateUserProfile(foundUser.id, {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          address: form.address
        });
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  return (
    <div className="flex justify-center pt-20 h-auto">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl border border-gray-300 shadow-md">
        
        {/* User Avatar */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user?.imageUrl}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md transition-transform hover:scale-105"
          />
        </div>

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Cập nhật thông tin</h2>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-md font-medium text-gray-600 mb-1">Họ:</label>
              <Input
                name="firstName"
                placeholder="Nhập họ"
                value={form.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-md font-medium text-gray-600 mb-1">Tên:</label>
              <Input
                name="lastName"
                placeholder="Nhập tên"
                value={form.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-md font-medium text-gray-600 mb-1">Số điện thoại:</label>
            <Input
              name="phoneNumber"
              placeholder="Nhập số điện thoại"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            />
          </div>


          <div>
            <label className="block text-md font-medium text-gray-600 mb-1">Tỉnh/Thành phố:</label>
            <Select 
              value={form.address.province?.code || ""} 
              onValueChange={handleProvinceChange}
              disabled={loading.provinces}
            >
              <SelectTrigger className="w-full outline-none border border-gray-200 shadow-sm  whitespace-nowrap h-14 rounded-xl bg-gray-50">
                <SelectValue 
                  placeholder={loading.provinces ? "Đang tải..." : "Chọn tỉnh/thành phố"} 
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
                {provinces.map(province => (
                  <SelectItem 
                    key={province.code} 
                    value={province.code}
                    className="hover:bg-gray-100 py-2 px-4"
                  >
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-md font-medium text-gray-600 mb-1">Quận/Huyện:</label>
            <Select 
              value={form.address.district?.code || ""} 
              onValueChange={handleDistrictChange}
              disabled={!form.address.province || loading.districts}
            >
              <SelectTrigger className="w-full outline-none border border-gray-200 shadow-sm  whitespace-nowrap h-14 rounded-xl bg-gray-50">
                <SelectValue 
                  placeholder={
                    loading.districts 
                      ? "Đang tải..." 
                      : !form.address.province 
                        ? "Vui lòng chọn tỉnh/thành trước" 
                        : "Chọn quận/huyện"
                  } 
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
                {districts.map(district => (
                  <SelectItem 
                    key={district.code} 
                    value={district.code}
                    className="hover:bg-gray-100 py-2 px-4"
                  >
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-md font-medium text-gray-600 mb-1">Phường/Xã:</label>
            <Select 
              value={form.address.ward?.code || ""} 
              onValueChange={handleWardChange}
              disabled={!form.address.district || loading.wards}
            >
              <SelectTrigger className="w-full outline-none border border-gray-200 shadow-sm  whitespace-nowrap h-14 rounded-xl bg-gray-50">
                <SelectValue 
                  placeholder={
                    loading.wards 
                      ? "Đang tải..." 
                      : !form.address.district 
                        ? "Vui lòng chọn quận/huyện trước" 
                        : "Chọn phường/xã"
                  } 
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
                {wards.map(ward => (
                  <SelectItem 
                    key={ward.code} 
                    value={ward.code}
                    className="hover:bg-gray-100 py-2 px-4"
                  >
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-md font-medium text-gray-600 mb-1">Địa chỉ chi tiết:</label>
            <Input
              placeholder="Số nhà, đường, ngõ..."
              value={form.address.detail || ""}
              onChange={handleDetailChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            />
          </div>

        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          Lưu thông tin
        </Button>
      </div>
    </div>
  );
}