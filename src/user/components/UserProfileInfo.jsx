import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './../../../configs'
import { eq } from 'drizzle-orm';
import { User } from './../../../configs/schema';
import { Phone, Home, Mail, Contact, Flag } from 'lucide-react'


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

  return (
    <div className="md:w-1/4 w-full bg-white rounded-2xl p-6 shadow-xl h-fit">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={user.imageUrl}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md transition-transform hover:scale-105"
        />
        <h1 className="mt-4 text-2xl font-semibold text-gray-800 text-center">
          {user.firstName} {user.lastName}
        </h1>
      </div>

      {/* Thông tin chi tiết */}
      <div className="text-sm text-gray-700 mb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span className="font-medium">Email:</span>
          <span>{user.email || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span className="font-medium">Phone:</span>
          <span>{user.phoneNumber || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          <span className="font-medium">Address:</span>
          <span>{user.address || 'N/A'}</span>
        </div>
      </div>

      {/* Hành động */}
      <div className="space-y-4">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          Send Message
        </button>

        <div className="flex gap-2">
          <button className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2">
            <Contact className="w-4 h-4" />
            Contacts
          </button>
          <button className="flex-1 text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2">
            <Flag className="w-4 h-4" />
            Report User
          </button>
        </div>
      </div>
    </div>

  );
};

export default UserProfileInfo;
