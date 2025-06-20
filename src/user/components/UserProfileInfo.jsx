import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './../../../configs'
import { eq } from 'drizzle-orm';
import { User } from './../../../configs/schema';
import { Phone, Home, Mail, Contact, Flag } from 'lucide-react'
import Report from '@/components/Report';

const formatAddress = (address) => {
  if (!address) return 'N/A';
  if (typeof address === 'string') return address;
  const parts = [];
  if (address.detail) parts.push(address.detail);
  if (address.ward?.name) parts.push(address.ward.name);
  if (address.district?.name) parts.push(address.district.name);
  if (address.province?.name) parts.push(address.province.name);
  
  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

const UserProfileInfo = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await db.select().from(User).where(eq(User.id, Number(id)));
        setUser(result[0] || null);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const formattedAddress = formatAddress(user.address);

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-xl h-fit">
      {/* Avatar and Name */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg transition-transform hover:scale-105 duration-300"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-800 text-center">
          {user.firstName} {user.lastName}
        </h1>
      </div>

      {/* User Information */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Email</p>
            <p className="text-sm">{user.email || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Phone className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Số điện thoại</p>
            <p className="text-sm">{user.phoneNumber || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Địa chỉ</p>
            <p className="text-sm">{formattedAddress}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <a
          href={`mailto:${user.email}`}
          className=" w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 font-medium"
        >
          <Mail className="w-4 h-4" />
          Gửi email
        </a>

        {user.phoneNumber && (
          <a
            href={`tel:${user.phoneNumber}`}
            className=" w-full bg-green-600 hover:bg-green-700 text-white text-center font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Gọi điện thoại
          </a>
        )}
        <div className="flex gap-2 justify-end">
          <Report entityType="user" entity={user} />
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;