import Header from '@/components/Header'
import React from 'react'
import DetailHeader from '../components/DetailHeader'

function ListingDetail() {
  return (
    <div>
        <Header/>

        <div className='p-10 md:p-20'>
            {/* Header Detail Component */}
            <DetailHeader/>
            
        </div>
        
    </div>
  )
}

export default ListingDetail