import React from 'react'
import MyListing from './components/MyListing'
import Header from '@/components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FavoriteList from './components/FavoriteCar'
import ProfileInfo from './components/ProfileInfo'
import MyBlog from './components/MyBlog'
import { useUser } from '@clerk/clerk-react'
import Service from '@/Shared/Service'
import { useState, useEffect } from 'react'
import ViewHistory from './components/ViewHistory'
import Footer from '@/components/Footer'
import MyAppointment from './components/MyAppointment'
import ChatWidget from '@/components/ChatWidget'


function Profile() {

  const { user } = useUser()
  const [currentUser, setCurrentUser] = useState(null)
  
  useEffect(() => {
    const getCurrentUser = async () => {
      if (!user) return;
      const fetchedUser = await Service.GetUserByClerkId(user.id);
      if (!fetchedUser) {
        console.error("Không tìm thấy user trong database.");
        return;
      }
      //console.log("Fetched user:", fetchedUser.id);
      setCurrentUser(fetchedUser);
    };
    getCurrentUser();
  }, [user]);

  if (!user) {
  return <div>Đang tải...</div>;
}

  return (
    <div>
        <Header/>
        <div className='px-10 md:px-20 my-10'>
        <Tabs defaultValue="my-listing" className="w-full" >
        <TabsList className="w-full justify-start">
            <TabsTrigger value="my-listing">Danh Sách Của Tôi</TabsTrigger>
            <TabsTrigger value="my-blog">Blog Của Tôi</TabsTrigger>
            <TabsTrigger value="my-appointment">Lịch Hẹn Xem Xe</TabsTrigger>
            <TabsTrigger value="profile">Hồ Sơ</TabsTrigger>
            <TabsTrigger value="favorite">Xe Yêu Thích</TabsTrigger>
            <TabsTrigger value="history">Lịch Sử</TabsTrigger>
        </TabsList>

        <TabsContent value="my-listing">
        <MyListing 
          currentUserId={currentUser?.id} 
          showEditButton={true}
        />
        </TabsContent>

        <TabsContent value="my-blog">
        <MyBlog 
          currentUserId={currentUser?.id} 
          showEditButton={true}
        />
        </TabsContent>

        <TabsContent value="my-appointment">
          <MyAppointment />
        </TabsContent>


        <TabsContent value="profile">
          <ProfileInfo />
        </TabsContent>


        <TabsContent value="favorite">
        <FavoriteList />
        </TabsContent>

        <TabsContent value="history">
          <ViewHistory currentUserId={currentUser?.id} />
        </TabsContent>
        </Tabs>
    </div>
    <ChatWidget />
    <Footer />
    </div>
    
  )
}

export default Profile