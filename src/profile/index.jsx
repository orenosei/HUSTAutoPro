import React from 'react'
import MyListing from './components/MyListing'
import Header from '@/components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


function Profile() {
  return (
    <div>
        <Header/>
        <div className='px-10 md:px-20 my-10'>
        <Tabs defaultValue="my-listing" className="w-full" >
        <TabsList className="w-full justify-start">
            <TabsTrigger value="my-listing">Danh Sách Của Tôi</TabsTrigger>
            <TabsTrigger value="inbox">Hộp Thư</TabsTrigger>
            <TabsTrigger value="profile">Hồ Sơ</TabsTrigger>
        </TabsList>

        <TabsContent value="my-listing">
        <MyListing />
        </TabsContent>

        <TabsContent value="inbox">Hộp Thư</TabsContent>
        <TabsContent value="profile">Hồ Sơ</TabsContent>
        </Tabs>
    </div>
    </div>
    
  )
}

export default Profile