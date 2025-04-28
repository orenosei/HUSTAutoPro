import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { Home } from 'lucide-react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <RouterProvider router={router} /> 
  </StrictMode>,
)
