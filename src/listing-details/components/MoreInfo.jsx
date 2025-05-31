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
    <button
      onClick={handleAskAboutCar}
      className="mt-4 w-full bg-gradient-to-r from-pink-600 to-blue-500 text-white py-3 rounded-lg hover:from-pink-700 hover:to-blue-600 transition-all flex items-center justify-center"
    >
      <img src="/arya.png" alt="Arya Avatar" className="h-8 w-8 rounded-full mr-3" />
      Trao đổi với Arya
    </button>
  );
};

export default MoreInfo;