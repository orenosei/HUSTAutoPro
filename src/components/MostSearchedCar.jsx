import FakeData from '@/Shared/FakeData'
import React, { useState, useEffect } from 'react';
import CarItem from './CarItem'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { db } from './../../configs';
import { CarImages, CarListing } from './../../configs/schema';
import { desc, eq } from 'drizzle-orm';
import Service from '@/Shared/Service';
function MostSearchedCar() {
  const [carList, setCarList]=useState([]);
  useEffect(()=>{
    GetPopularCarList();
  }, [])
  

  const GetPopularCarList=async()=>{
    const result = await db
            .select()   
            .from(CarListing)
            .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
            // .where(eq(CarListing.createdBy, user?.primaryEmailAddress?.emailAddress))
            .where(eq(CarListing.createdBy, "dungdetanglike123@gmail.com")) // thay sau

            .orderBy(desc(CarListing.id))
            .limit(10)
      
          const resp = Service.FormatResult(result);
          console.log(resp);
          setCarList(resp);
          console.log(carList);
  }
  return (
    <div className='mx-24'>
      <h2 className='font-bold text-3xl text-center mt-16 mb-7'>Most Searched Cars</h2>
      <Carousel>
      <CarouselContent>
        {carList.map((car, index) => (
        <CarouselItem key={index} className="basis-1/4">
          <CarItem car = {car} />
        </CarouselItem>
      ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      </Carousel>
      
    </div>
  )
}

export default MostSearchedCar