import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Search from '@/components/Search';
import Header from '@/components/Header'; 
import { CarImages, CarListing } from './../../configs/schema';
import { db } from './../../configs';  
import { eq, lte, and } from 'drizzle-orm';
import { useSearchParams } from 'react-router-dom';
import CarItem from '@/components/CarItem';
import Service from '@/Shared/Service';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import MostSearchedCar from '@/components/MostSearchedCar';
import { or, ilike, gte } from 'drizzle-orm';


function SearchByOptions() {
  
  const [searchParam] = useSearchParams();
  const [carList, setCarList] = useState([]);
  const condition=searchParam.get('cars');
  const make=searchParam.get('make');
  const price=searchParam.get('price');
  const minYear = searchParam.get('minYear');
  const maxYear = searchParam.get('maxYear');
  const bodyType = searchParam.get('bodyType');
  const transmission = searchParam.get('transmission');
  const driveType = searchParam.get('driveType');
  const fuelType = searchParam.get('fuelType');
  const color = searchParam.get('color');
  const mileage = searchParam.get('mileage');
  const keyword = searchParam.get('keyword');


  useEffect(() => {
    GetCarList();
  }, [condition, make, price, minYear, maxYear, bodyType, transmission, driveType, fuelType, color, mileage, keyword]);

  const GetCarList = async () => {
    try {
      // Tạo query cơ bản
      let query = db.select()
        .from(CarListing)
        .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId));
  
      const conditions = [];
      
      if (condition) conditions.push(eq(CarListing.condition, condition));
      if (make) conditions.push(eq(CarListing.make, make));
      if (price) conditions.push(lte(CarListing.sellingPrice, Number(price)));
      if (minYear) conditions.push(gte(CarListing.year, Number(minYear)));
      if (maxYear) conditions.push(lte(CarListing.year, Number(maxYear)));
      if (bodyType) conditions.push(eq(CarListing.category, bodyType));
      if (transmission) conditions.push(eq(CarListing.transmission, transmission));
      if (driveType) conditions.push(eq(CarListing.driveType, driveType));
      if (fuelType) conditions.push(eq(CarListing.fuelType, fuelType));
      if (color) conditions.push(eq(CarListing.color, color));
      if (mileage) conditions.push(gte(CarListing.mileage, Number(mileage)));

      if (keyword) {
        conditions.push(or(
          ilike(CarListing.listingTitle, `%${keyword}%`),
          ilike(CarListing.tagline, `%${keyword}%`),
          ilike(CarListing.listingDescription, `%${keyword}%`)
        ));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
  
      const result = await query;
      const resp = Service.FormatResult(result) || [];
      
      setCarList(resp);
  
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCarList([]);
    }
  }

  return (
    <div> 
      <Header />

      <div className='p-16 flex justify-center '
            style={{
              background: 'linear-gradient(0deg, #ffbdbd, #f9636d, #c3000e)'
            }}>
          <Search />
      </div>
      <div className='p-10 md:px-20'>
          <h2 className='font-bold text-4xl '>Kết Quả Tìm Kiếm </h2>
          {(condition || make || price || minYear || maxYear || bodyType || transmission || driveType || fuelType || color || mileage || keyword) && (
            <div className='text-sm text-gray-500 mt-2'>
              {carList.length} xe được tìm thấy
            </div>
          )}
          
          {/* List of CarList */}
          {condition || make || price || minYear || maxYear || bodyType || transmission || driveType || fuelType || color || mileage || keyword ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7'>
              {carList?.length > 0 ? (
                carList.map((item) => (
                  <div key={item.id}>
                    <CarItem car={item} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-lg text-gray-500 py-12">
                  Không tìm thấy xe nào phù hợp
                </div>
              )}
            </div>
          ) : (
            <div className="col-span-full text-center text-lg text-gray-500 py-12">
              Không tìm thấy xe nào phù hợp
            </div>
          )}
      </div>
      <div className='my-8'>
          <MostSearchedCar />
      </div>

      <ChatWidget />        
      <Footer />
    </div>
  )
}

export default SearchByOptions
