import { Button } from '@/components/ui/Button'
import { useUser } from '@clerk/clerk-react'
import { db } from './../../../configs'
import { CarListing, CarImages } from './../../../configs/schema'
import { eq, desc } from 'drizzle-orm'
import React, { useEffect } from 'react' 
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Service from '@/Shared/Service'
import CarItem from '@/components/CarItem'
import { FaTrashAlt } from 'react-icons/fa'

function MyListing() {

  const {user}=useUser();
  //console.log(user);
  const [carList,setCarList]=useState([]);

  useEffect(()=>{
    user && GetUserCarListing();

  }, [user])

  const GetUserCarListing = async () => {
    try {
      const result = await db
        .select()
        .from(CarListing)
        .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
        .where(eq(CarListing.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(CarListing.id));
  
      const resp = Service.FormatResult(result);
      setCarList(resp);
      //console.log(resp);
    } catch (error) {
      console.error("Error fetching user car listings:", error);
    }
  };
  


  return (

    <div className='mt-6'>
        <div className='flex justify-between items-center'>
            <h2 className='font-bold text-4xl'>My Listing</h2>
            <Link to={'/add-listing'}>
                <Button className='bg-blue-500 text-white hover:scale-110' > + Add New Listing</Button>
            </Link>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7'>
          {carList.map((item,index)=>(
            <div key={index}>
                <CarItem car={item} />
                <div className='p-3 bg-gray-100 rounded-lg flex justify-between mt-2 gap-5'>
                    <Link to={'/add-listing?profile?mode=edit&id='+ item?.id} >
                        <Button className='flex-1 border-gray-300 bg-white text-center hover:bg-gray-200'>Edit</Button>
                    </Link>
                    <Button className='text-white bg-red-400 flex-shrink-0 hover:bg-red-600'>
                      <FaTrashAlt />
                    </Button>
                </div>
              </div>
          ))}
        </div>
    </div>  
  )
}

export default MyListing;