import { Button } from '@/components/ui/Button'
import { db } from './../../../configs'
import { CarListing, CarImages, User } from './../../../configs/schema'
import { eq, desc } from 'drizzle-orm'
import React, { useEffect } from 'react' 
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Service from '@/Shared/Service'
import CarItem from '@/components/CarItem'
import { FaTrashAlt } from 'react-icons/fa'
import { toast } from 'sonner';
import { BiLoaderAlt } from 'react-icons/bi';
function MyListing({currentUserId, showEditButton}) {

  const [carList,setCarList]=useState([]);
  const [deletingId, setDeletingId] = useState(null); 

  useEffect(()=>{
    currentUserId && GetUserCarListing();
  }, [currentUserId])

  const GetUserCarListing = async () => {
    try {
      const result = await db
        .select()
        .from(CarListing)
        .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
        .innerJoin(User, eq(CarListing.createdBy, User.id))
        .where(eq(currentUserId, User.id))
        .orderBy(desc(CarListing.id));
  
      const resp = Service.FormatResult(result);
      setCarList(resp);

    } catch (error) {
      console.error("Error fetching user car listings:", error);
    }
  };
  
  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xe này?')) return;
    
    try {
      setDeletingId(carId);

      await db.delete(CarListing)
        .where(eq(CarListing.id, carId));

      setCarList(prev => prev.filter(item => item.id !== carId));
      toast.success('Xóa xe thành công');
    } catch (error) {
      console.error("Lỗi khi xóa xe:", error);
      toast.error('Xóa xe thất bại');
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className='mt-6'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-4xl'>Danh Sách Của Tôi</h2>
        <Link to={'/add-listing'}>
          <Button className='bg-red-500 text-white hover:scale-110'>Đăng Xe Mới</Button>
        </Link>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7'>
        {carList.map((item, index) => (
          <div key={index} className="relative group">
            <CarItem car={item} />

          { showEditButton && (
            <div className='absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Link to={`/add-listing?mode=edit&id=${item?.id}`}>
                <Button className='bg-green-500 hover:bg-green-600 text-white p-2'>
                  Chỉnh Sửa
                </Button>
              </Link>
              <Button
                className='bg-red-500 hover:bg-red-600 text-white p-2'
                onClick={() => handleDeleteCar(item?.id)}
                disabled={deletingId === item?.id}
              >
                {deletingId === item?.id ? (
                  <BiLoaderAlt className="animate-spin" />
                ) : (
                  <FaTrashAlt />
                )}
              </Button>
            </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyListing;