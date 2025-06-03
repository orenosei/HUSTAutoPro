import React from 'react';
import { useState, useEffect } from 'react';
import { LuFuel } from "react-icons/lu";
import { Separator } from './ui/separator';
import { TbBrandSpeedtest } from "react-icons/tb";
import { GiGearStickPattern } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import  Service from '@/Shared/Service';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

function CarItem({ car }) {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
    if (car) {
      checkLikeStatus();
    }
  }, [car, user]);

  const checkLikeStatus = async () => {
    if (user && car?.id) {
      try {
        const result = await Service.CheckCarLikeStatus(user.id, car.id);
        setIsLiked(result);
      } catch (error) {
        console.error("Lỗi kiểm tra trạng thái like:", error);
      }
    }
  };

  const handleLikeButtonClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích.");
      return;
    }

    const previousIsLiked = isLiked;
  
    setIsLiked(!previousIsLiked);

    try {
      if (previousIsLiked) {
        await Service.RemoveFromFavorite(user.id, car.id);
      } else {
        await Service.AddToFavorite(user.id, car.id);
      }
    } catch (error) {
      setIsLiked(previousIsLiked);
      toast.error("Lỗi khi thao tác yêu thích");
    }
  };

  const formatMileage = (mileage) => {
    if (!mileage) return 'N/A';
    const num = Number(mileage);
    if (isNaN(num)) return mileage;
    if (num % 1000 === 0 && num >= 1000) {
      return `${num / 1000}k Dặm`;
    }
    return `${num} Dặm`;
  };

  return (
    <div className="">
      {car ? (
        <Link to={`/listing-details/${car.id}`} className="w-full block">
          <div className="rounded-2xl bg-white border-3 border-gray-300 hover:shadow-md cursor-pointer hover:scale-105 transition-transform">
            {car?.postedOn && new Date().getTime() - new Date(car.postedOn).getTime() <= 3 * 24 * 60 * 60 * 1000 ? 
              <h2 className="absolute m-2 bg-green-500 px-2 rounded-full text-sm text-white">New</h2> : null}
            <img
              src={car?.images?.[0]?.imageUrl || '/path/to/placeholder.jpg'}
              alt={car?.listingTitle || 'Car Image'}
              width="100%"
              height={250}
              className="rounded-t-xl h-[180px] object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-black text-lg">{car?.listingTitle || 'Unknown Title'}</h2>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleLikeButtonClick}
                    className={`text-xl transition-all duration-300 hover:scale-125 ${
                      isLiked ? 'text-red-600' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                  </button>
                </div>

              </div>
              <Separator className="bg-gray-200" />

              <div className="grid grid-cols-3 mt-5">
                <div className="flex flex-col items-center">
                  <TbBrandSpeedtest className="text-lg mb-2" />
                  <h2 className="text-sm">{car?.mileage ? formatMileage(car.mileage) : 'Xe mới'}</h2>
                </div>
                <div className="flex flex-col items-center">
                  <LuFuel className="text-lg mb-2" />
                  <h2 className="text-sm">{car?.fuelType || 'N/A'}</h2>
                </div>
                <div className="flex flex-col items-center">
                  <GiGearStickPattern className="text-lg mb-2" />
                  <h2 className="text-sm">{car?.transmission || 'N/A'}</h2>
                </div>
              </div>
              <Separator className="my-2 bg-gray-200" />
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl">{car?.sellingPrice 
                  ? Math.floor(Number(car?.sellingPrice)).toLocaleString('en-US')
                  : 'N/A'} VNĐ</h2>

              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-xl bg-slate-200 animate-pulse h-[330px] w-full"></div>
      )}
    </div>
  );
}

export default CarItem;
