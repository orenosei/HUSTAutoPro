import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {  RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

import Home from './home'
import Profile from './profile/index'
import AddListing from './add-listing'
import { Toaster } from "@/components/ui/sonner"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
  },

  {
    path: '/profile',
    element: <Profile/>,
  },

  {
    path: '/add-listing',
    element: <AddListing/>,
  }
])

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
} 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router}/> 
      <Toaster />
    </ClerkProvider>
  </StrictMode>,
)
 