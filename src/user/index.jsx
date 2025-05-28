import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBlog from './components/UserBlog';
import UserCarListing from './components/UserCarListing';
import UserProfileInfo from './components/UserProfileInfo';

function User() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <UserProfileInfo />

          <div className="md:w-2/3">
            <Tabs defaultValue="user-listing" className="w-full">
              <TabsList className="w-full justify-end p-2 rounded-lg">
                <TabsTrigger value="user-listing"> Danh Sách Xe</TabsTrigger>
                <TabsTrigger value="user-blog"> Blog</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="user-listing" ><UserCarListing /></TabsContent>
                <TabsContent value="user-blog" ><UserBlog /></TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

    <Footer />
    </div>
  );
}

export default User;