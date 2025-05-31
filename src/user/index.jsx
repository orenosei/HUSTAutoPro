import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserBlog from './components/UserBlog';
import UserCarListing from './components/UserCarListing';
import UserProfileInfo from './components/UserProfileInfo';
import { FaCar } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa6";



function User() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/3">
            <div className=" p-6 sticky top-24">
              <UserProfileInfo />
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="space-y-10">
              <section className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h1 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
                  <FaCar className="mr-2" />
                  Danh Sách Bài Đăng Xe
                </h1>
                <UserCarListing />
              </section>

              <section className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h1 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
                  <FaNewspaper className="mr-2" />
                  Blog
                </h1>
                <UserBlog />
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default User;