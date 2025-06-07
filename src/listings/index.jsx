import React, { useEffect, useState } from "react";
import { CarImages, CarListing } from './../../configs/schema';
import { db } from './../../configs';
import { eq, desc, asc } from "drizzle-orm";
import CarItem from "@/components/CarItem";
import Service from "@/Shared/Service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 

export default function ListingPage() {
  const [carList, setCarList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const carsPerPage = 12;

  useEffect(() => {
    GetCarList();
  }, [sortOption]);

  const GetCarList = async () => {
    try {
      setCurrentPage(1);
      
      let query = db.select()
        .from(CarListing)
        .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId));
      
      switch(sortOption) {
        case "oldest":
          query = query.orderBy(asc(CarListing.postedOn));
          break;
        case "price_asc":
          query = query.orderBy(asc(CarListing.sellingPrice));
          break;
        case "price_desc":
          query = query.orderBy(desc(CarListing.sellingPrice));
          break;
        default:
          query = query.orderBy(desc(CarListing.postedOn));
      }

      const result = await query;
      const resp = Service.FormatResult(result) || [];
      setCarList(resp);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCarList([]);
    }
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = carList.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(carList.length / carsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <div className='p-10 md:px-20'>
        <h2 className='font-bold text-4xl '>Danh Sách Tất Cả Xe</h2>
        <div className='text-sm text-gray-500 mt-2'>
          {carList.length} xe đang được đăng bán
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6 gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-md whitespace-nowrap">Sắp xếp theo:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Chọn kiểu sắp xếp" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-sm">
                <SelectGroup>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="price_asc">Giá tăng dần</SelectItem>
                  <SelectItem value="price_desc">Giá giảm dần</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => window.location.href = '/add-listing'}
          >
            + Đăng Xe Mới
          </button>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7'>
          {carList?.length > 0 ? (
            currentCars.map((item) => (
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

        {/* Pagination */}
        {carList.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                Trang Trước
              </button>
              
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-4 py-2 rounded-lg ${currentPage === number + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {number + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                Trang Sau
              </button>
            </div>
          </div>
        )}
      </div>
      <ChatWidget />
      <Footer />
    </div>
  );
}