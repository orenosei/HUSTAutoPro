import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {  RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

import Home from './home'
import Profile from './profile/index'
import AddListing from './add-listing'
import { Toaster } from "@/components/ui/sonner"
import Search from './components/Search'
import SearchByCategory from './search/[category]'
import SearchByOptions from './search'
import ListingDetail from './listing-details/[id]'
import FavoriteList from './profile/components/FavoriteCar'
import Blog from './blog'
import AddBlog from './blog/pages/AddBlog'
import User from './user'
import Admin from './admin'
import { ChatProvider } from './context/ChatContext'
import Intro from './intro'
import ListingPage from './listings'


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
  },
  {
    path:'/search',
    element: <SearchByOptions/> 
  },
  {
    path:'/search/:category',
    element: <SearchByCategory/> 
  },
  {
    path: '/listing-details/:id',
    element: <ListingDetail/>
  },
  {
    path: '/profile/favorites',
    element: <FavoriteList />
  },
  {
    path: '/blog',
    element: <Blog />
  },
  {
    path: '/blog/add',
    element: <AddBlog />
  },

  {
    path: '/user/:id',
    element: <User />
  },
  {
    path: '/admin',
    element: <Admin />
  },
  {
    path: '/intro',
    element: <Intro />
  },
  {
    path: '/listings',
    element: <ListingPage />
  },
])

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatProvider>
    <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    authorizationParams={{
        role: 'admin' // Role mặc định cho các action nhạy cảm
      }}
     afterSignOutUrl="/">
      <RouterProvider router={router}/> 
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '18px',
          },
          duration: 3000,
        }}
      />
    </ClerkProvider>
    </ChatProvider>
  </StrictMode>,
)
 