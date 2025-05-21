import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import CarItem from '@/components/CarItem';
import Service from '@/Shared/Service';

function FavoriteCar() {
  const { user } = useUser();
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        // Lấy userId thực từ db
        const foundUser = await Service.GetUserByClerkId(user.id);
        if (!foundUser) {
          console.error("Không tìm thấy user trong database.");
          setLoading(false);
          return;
        }

        const cars = await Service.GetFavoriteCars(foundUser.id);
        setFavoriteCars(cars);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Xe Yêu Thích</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : favoriteCars.length === 0 ? (
        <p>Chưa có xe yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteCars.map((car) => (
            <CarItem key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteCar;
