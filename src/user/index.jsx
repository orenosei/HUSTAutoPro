import React from 'react'
import Header from './../components/Header'
import Footer from './../components/Footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserListingCar from './components/UserCarListing'
import UserBlog from './components/UserBlog'
import UserProfileInfo from './components/UserProfileInfo'
import UserCarListing from './components/UserCarListing'
function User() {
  return (
    <div>
      <Header/>

      
      
      <div className='px-10 md:px-20 my-10'>
        <Tabs defaultValue="user-listing" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="user-listing">Danh Sách Xe</TabsTrigger>
            <TabsTrigger value="user-blog">Blog</TabsTrigger>
            <TabsTrigger value="user-profile">Hồ Sơ</TabsTrigger>
          </TabsList>

          <TabsContent value="user-listing">
            <UserCarListing />
          </TabsContent>

          <TabsContent value="user-blog">
            <UserBlog />
          </TabsContent>

          <TabsContent value="user-profile">
            <UserProfileInfo />
          </TabsContent>




        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

export default User