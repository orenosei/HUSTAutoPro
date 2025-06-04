import React from 'react';
import { FaRobot } from 'react-icons/fa';
import { useChat } from '@/context/ChatContext.jsx';

const MoreInfo = ({ carDetail }) => {
  const { askAboutCar } = useChat();

  if (!carDetail) return null;

  const handleAskAboutCar = () => {
    const carInfo = {
      make: carDetail.make,
      model: carDetail.model,
      year: carDetail.year,
      sellingPrice: carDetail.sellingPrice,
      condition: carDetail.condition,
      mileage: carDetail.mileage,
    };
    
    askAboutCar(carInfo);
  };

  return (
    <div className="grid place-items-end">
      <img src="/arya.png" alt="Arya Avatar" className="h-30 w-30 " />
      <button
        onClick={handleAskAboutCar}
        className="w-full text-xl bg-gradient-to-r from-pink-600 to-blue-500 text-white py-3 rounded-lg hover:from-pink-700 hover:to-blue-600 transition-all flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
      >
        Trao đổi ngay với Arya !
      </button>
    </div>
  );
};

export default MoreInfo;