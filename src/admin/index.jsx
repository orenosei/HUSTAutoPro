import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LockKeyhole, Car, Newspaper, Users, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'

import CarListingManagement from './components/CarListingManagement'
import BlogManagement from './components/BlogManagement'
import ReportManagement from './components/ReportManagement'
import UserManagement from './components/UserManagement'
import { useClerk } from '@clerk/clerk-react'

function Admin() {
    const { signOut } = useClerk();
    const adminKey = import.meta.env.VITE_ADMIN_KEY;
    const [showDashboard, setShowDashboard] = useState(false);
    const [inputKey, setInputKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputKey === adminKey) {
            await signOut({ redirectUrl: null });
            setShowDashboard(true);
            setError('');
        } else {
            setError('Admin key không đúng!');
            setInputKey('')
        }
    };

    if (!showDashboard) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 z-50">
                <form 
                    onSubmit={handleSubmit}
                    className="bg-slate-100 p-8 rounded-2xl shadow-xl flex flex-col gap-6 min-w-[400px] border border-slate-200"
                >
                    <div className="space-y-2 text-center">
                        <div className="flex justify-center">
                            <LockKeyhole className="w-12 h-12 text-blue-600 mb-4" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800">Admin Access</h2>
                        <p className="text-slate-600">Vui lòng nhập mã bảo mật để tiếp tục</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="password"
                            value={inputKey}
                            onChange={e => setInputKey(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Nhập Admin Key..."
                            autoFocus
                        />
                        
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Xác nhận
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className='px-4 md:px-8 lg:px-16 py-8'>
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 space-y-2">
                        <h1 className='text-4xl font-bold text-slate-800'>Dashboard Quản trị viên</h1>

                    </header>

                    <Tabs defaultValue="car-listing-management" className="w-full">
                        <TabsList className="w-full bg-transparent p-0 h-auto flex flex-wrap gap-4 border-b border-slate-200 rounded-none">
                            {[
                                { value: "car-listing-management", icon: Car, label: "Bài đăng xe" },
                                { value: "blog-management", icon: Newspaper, label: "Blog" },
                                { value: "user-management", icon: Users, label: "Người dùng" },
                                { value: "report-management", icon: Flag, label: "Báo cáo" },
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value}
                                    className="group px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none bg-transparent hover:bg-slate-100 gap-2 transition-all shadow-none"
                                >
                                    <tab.icon className="w-5 h-5 text-current" />
                                    <span className="text-lg">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="pt-8">
                            <TabsContent value="car-listing-management">
                                <CarListingManagement />
                            </TabsContent>

                            <TabsContent value="blog-management">
                                <BlogManagement />
                            </TabsContent>

                            <TabsContent value="report-management">
                                <ReportManagement />
                            </TabsContent>

                            <TabsContent value="user-management">
                                <UserManagement />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default Admin