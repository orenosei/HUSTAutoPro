import React, { useState, useEffect } from 'react';
import CarItem from './CarItem'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Service from '@/Shared/Service';

function MostSearchedCar() {
  const [carList, setCarList] = useState([]);
  
  useEffect(() => {
    const GetPopularCarList = async () => {
      const result = await Service.GetPopularCars();
      setCarList(result);
    };
    
    GetPopularCarList();
  }, []);

  return (
    <div className='mx-24'>
      <h2 className='font-bold text-3xl text-center mt-16 mb-8'>Xe Được Yêu Thích Nhất</h2>
      {carList.length > 0 ? (
        <Carousel>
          <CarouselContent className="overflow-visible">
            {carList.map((car, index) => (
              <CarouselItem key={index} className="basis-1/4 p-3 h-auto">
                <div className="h-full p-3"> 
                  <CarItem car={car} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Chưa có dữ liệu xe phổ biến</p>
        </div>
      )}
    </div>
  )
}

export default MostSearchedCar