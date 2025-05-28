import { db } from './../../../configs'
import { CarListing, CarImages, User } from './../../../configs/schema'
import { eq, desc } from 'drizzle-orm'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Service from '@/Shared/Service'
import CarItem from '@/components/CarItem'

function UserCarListing() {
  const { id: userId } = useParams()
  const [carList, setCarList] = useState([])

  useEffect(() => {
    userId && GetUserCarListing()
  }, [userId])

  const GetUserCarListing = async () => {
    try {
      const result = await db
        .select()
        .from(CarListing)
        .leftJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
        .innerJoin(User, eq(CarListing.createdBy, User.id))
        .where(eq(User.id, Number(userId)))
        .orderBy(desc(CarListing.id))

      const resp = Service.FormatResult(result)
      setCarList(resp)
    } catch (error) {
      console.error("Lỗi. Không có dữ liệu về xe", error)
    }
  }

  return (
    <div className='mt-6'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7'>
        {carList.map((item, index) => (
          <CarItem key={index} car={item} />
        ))}
      </div>
    </div>
  )
}

export default UserCarListing