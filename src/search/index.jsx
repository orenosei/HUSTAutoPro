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


function SearchByOptions() {
  
  const [searchParam] = useSearchParams();
  const [carList, setCarList] = useState([]);
  const condition=searchParam.get('cars');
  const make=searchParam.get('make');
  const price=searchParam.get('price');


  useEffect(() => {
    GetCarList();
  }, [condition, make, price]);

  const GetCarList = async () => {
    try {
      // Tạo query cơ bản
      let query = db.select()
        .from(CarListing)
        .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId));
  
      // Thêm các điều kiện lọc
      const conditions = [];
      
      if (condition) {
        conditions.push(eq(CarListing.condition, condition));
      }
      
      if (make) {
        conditions.push(eq(CarListing.make, make));
      }
      
      if (price) {
        conditions.push(lte(CarListing.sellingPrice, Number(price)));
      }
  
      // Áp dụng tất cả điều kiện
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
  
      const result = await query;
      const resp = Service.FormatResult(result) || [];
      
      setCarList(resp);
      console.log('Filter params:', { condition, make, price });
      console.log(CarListing.sellingPrice)
      console.log('Filtered results:', resp);
  
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCarList([]);
    }
  }

  return (
    <div> 
      <Header />

      <div className='p-16 bg-black flex justify-center '>
          <Search />
      </div>
      <div className='p-10 md:px-20'>
          <h2 className='font-bold text-4xl '>Kết Quả Tìm Kiếm </h2>
          <div className='text-sm text-gray-500 mt-2'>
            {carList.length} xe được tìm thấy
          </div>
          
          {/* List of CarList */}
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
      </div>

      <ChatWidget />        
      <Footer />
    </div>
  )
}

export default SearchByOptions
