import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CarListingReport from './components/CarListingReport'
import BlogReport from './components/BlogReport'
import UserReport from './components/UserReport'

function ReportManagement() {
  return (
    <div>

      <Tabs defaultValue="car-listing" className="w-full gap-2">
        <TabsList className="w-full gap-2">
          <TabsTrigger
            value="car-listing"
            className="data-[state=active]:bg-gray-200"
          >
            Bài đăng xe
          </TabsTrigger>
          <TabsTrigger
            value="blog"
            className="data-[state=active]:bg-gray-200"
          >
            Blog
          </TabsTrigger>
          <TabsTrigger
            value="user"
            className="data-[state=active]:bg-gray-200"
          >
            Người dùng
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="car-listing">
          <CarListingReport />
        </TabsContent>
        <TabsContent value="blog">
          <BlogReport />
        </TabsContent>
        <TabsContent value="user">
          <UserReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportManagement