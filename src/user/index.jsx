import React from 'react'
import Header from './../components/Header'
import Footer from './../components/Footer'
import MyListing from "../profile/components/MyListing.jsx";
import ProfileInfo from "../profile/components/ProfileInfo.jsx";
import MyBlog from "../profile/components/MyBlog.jsx";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



function User() {
  return (
    <div>

      <div>
        <Header/>
        <div className='px-10 md:px-20 my-10'>
        <Tabs defaultValue="my-listing" className="w-full" >
        <TabsList className="w-full justify-start">
            <TabsTrigger value="my-listing">Danh Sách Của Tôi</TabsTrigger>
            <TabsTrigger value="my-blog">Blog Của Tôi</TabsTrigger>
            <TabsTrigger value="profile">Hồ Sơ</TabsTrigger>
        </TabsList>

        <TabsContent value="my-listing">
        <MyListing />
        </TabsContent>

        <TabsContent value="my-blog">
        <MyBlog />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileInfo />
        </TabsContent>


        </Tabs>
    </div>
    </div>

      {/*<Footer /> */}
      <Footer />

    </div>
  )
}

export default User