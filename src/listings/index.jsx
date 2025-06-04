import React, { useEffect, useState } from "react";
import { CarImages, CarListing } from './../../configs/schema';
import { db } from './../../configs';
import { eq } from "drizzle-orm";
import CarItem from "@/components/CarItem";
import Service from "@/Shared/Service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function ListingPage() {
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    GetCarList();
  }, []);

  const GetCarList = async () => {
    try {
      let query = db.select()
        .from(CarListing)
        .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId));
      const result = await query;
      const resp = Service.FormatResult(result) || [];
      setCarList(resp);
    } catch (error) {
      setCarList([]);
    }
  };

  return (
    <div>
      <Header />
      <div className='p-10 md:px-20'>
        <h2 className='font-bold text-4xl '>Danh Sách Tất Cả Xe</h2>
        <div className='text-sm text-gray-500 mt-2'>
          {carList.length} xe đang được đăng bán
        </div>

        <div className="flex justify-end mb-6">
          <button
            className="px-4 py-2 mr-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => window.location.href = '/add-listing'}
          >
            + Đăng Xe Mới
          </button>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7'>
          {carList?.length > 0 ? (
            carList.map((item) => (
              <div key={item.id}>
                <CarItem car={item} />
              </div>
            ))
          ) : (
            [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index} className='h-[320px] rounded-xl bg-slate-200 animate-pulse'></div>
            ))
          )}
        </div>
      </div>
      <ChatWidget />
      <Footer />
    </div>
  );
}
