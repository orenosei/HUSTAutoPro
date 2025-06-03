import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import CarItem from '@/components/CarItem';
import Service from '@/Shared/Service';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { toast } from 'sonner';
import { db } from './../../../configs'
import { eq } from 'drizzle-orm';
import { CarFavourite } from './../../../configs/schema';


function FavoriteCar() {
  const { user } = useUser();
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

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

  const handleRemoveFavorite = async (carId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này khỏi danh sách yêu thích?')) return;

    try {
      setDeletingId(carId);

      await db.delete(CarFavourite).where(eq(CarFavourite.carListingId, carId));

      setFavoriteCars((prev) => prev.filter((car) => car.id !== carId));

      toast.success('Đã xóa xe khỏi danh sách yêu thích');
    } catch (error) {
      console.error("Lỗi khi xóa xe khỏi danh sách yêu thích:", error);
      toast.error('Xóa xe khỏi danh sách yêu thích thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRemoveAllFavorites = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tất cả xe khỏi danh sách yêu thích?')) return;

    try {
      setDeletingAll(true);
      const foundUser = await Service.GetUserByClerkId(user.id);
      if (!foundUser) {
        toast.error("Không tìm thấy thông tin người dùng.");
        return;
      }

      await db.delete(CarFavourite).where(eq(CarFavourite.userId, foundUser.id));
      setFavoriteCars([]);
      toast.success('Đã xóa tất cả xe khỏi danh sách yêu thích');
    } catch (error) {
      console.error("Lỗi khi xóa tất cả xe khỏi danh sách yêu thích:", error);
      toast.error('Xóa tất cả xe khỏi danh sách yêu thích thất bại');
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-4xl">Xe Yêu Thích Của Tôi</h2>
        {favoriteCars.length > 0 && (
          <Button
            className="text-white bg-red-400 flex-shrink-0 hover:bg-red-600"
            onClick={handleRemoveAllFavorites}
            disabled={deletingAll}
          >
            {deletingAll ? <BiLoaderAlt className="animate-spin" /> : <><FaTrashAlt className="mr-2" /> Xóa tất cả</>}
          </Button>
        )}
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : favoriteCars.length === 0 ? (
        <p className="text-red-400 italic mt-8 text-center">Chưa có xe yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7">
          {favoriteCars.map((car, index) => (
            <div key={car.id || index} className="p-3 flex flex-col">
              <CarItem car={car} />
              <div 
                className="p-3 bg-red-100 rounded-lg flex justify-center items-center mt-2 gap-5 hover:bg-red-200 transition-colors cursor-pointer"
                onClick={() => handleRemoveFavorite(car.id)}
              >
                {deletingId === car.id ? (
                  <BiLoaderAlt className="animate-spin text-red-500 text-xl" />
                ) : (
                  <FaTrashAlt className="text-red-500 text-xl" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteCar;
