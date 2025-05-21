import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import DetailHeader from '../components/DetailHeader'
import { useParams } from 'react-router-dom'
import { db } from './../../../configs';
import { CarImages, CarListing, User } from './../../../configs/schema';
import Service from '@/Shared/Service';
import { eq } from 'drizzle-orm';
import ImageGallery from '../components/ImageGallery';
import Description from '../components/Description';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Specification from '../components/Specification';
import FinancialCalculator from '../components/FinancialCalculator';
import MostSearchedCar from '@/components/MostSearchedCar';
import CommentSection from '../components/CommentSection';
import Footer from '@/components/Footer';
import { useLocation } from 'react-router-dom';
import OwnerDetail from '../components/OwnerDetail';

function ListingDetail() {

  const {id} = useParams();
  const location = useLocation();
  const [carDetail, setCarDetail] = useState();
  //console.log(id);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
    GetCarDetail();

  }
  ,[id, location.pathname])

  const GetCarDetail = async () => {
    if (!id) return;

    const result=await db.select().from(CarListing)
    .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
    .innerJoin(User, eq(CarListing.createdBy, User.id))
    .where(eq(CarListing.id, id))
    const resp = Service.FormatResult(result);
    //console.log(resp[0]);
    setCarDetail(resp[0]);
  }



  return (
    <div>
        <Header/>

        <div className='p-10 md:px-20'>
            {/* Header Detail Component */}
            <DetailHeader carDetail={carDetail} />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 w-full'>
              {/* Left */}
              <div className=' md:col-span-2'>
                {/* Image Gallery  */}
                <ImageGallery carDetail={carDetail} />
                {/* Description */}
                <Description carDetail={carDetail} />
                {/* Feature List */}
                <Features features={carDetail?.features} />
                {/* Financial Calculator */}
                <FinancialCalculator carDetail={carDetail} />
              </div>

              {/* Right */}
              <div className=''>
                {/* Pricing */}
                <Pricing carDetail={carDetail} />
                {/* Car Specification */}
                <Specification carDetail={carDetail} />
                {/* Owners Details */}
                <OwnerDetail carDetail={carDetail} />
              </div>
            </div>
            <CommentSection carListingId={id} />
            <MostSearchedCar/>
        </div>

        <Footer/>
        
    </div>
  )
}

export default ListingDetail