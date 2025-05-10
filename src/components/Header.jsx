import { UserButton, useUser, SignInButton } from '@clerk/clerk-react'
import React from 'react'
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function Header() {
  const { user, isSignedIn } = useUser();
  
  return (
    <header className='flex justify-between items-center shadow-sm p-5 bg-white'>
      <img src='/logo.svg' alt='Logo' className='w-12 h-12 cursor-pointer hover:scale-110 transition-transform' />

      <nav>
        <ul className='hidden md:flex gap-20 text-gray-700'>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-blue-500'>
            <Link to='/'>Home</Link>
          </li>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-blue-500'>
            <Link to='/search'>Search</Link>
          </li>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-blue-500'>
            <Link to='/'>News</Link>
          </li>
          <li className=' rounded-xl font-medium hover:scale-105 transition-transform cursor-pointer hover:text-blue-500'>
            <Link to='/'>Contact</Link>
          </li>
        </ul>
      </nav>

      <div className='flex items-center gap-4'>
        {isSignedIn ? (
          <>
            <UserButton />
            <Link to='/profile'>
              <Button className='bg-blue-500 text-white hover:scale-110 hover:bg-blue-600 transition-transform px-4 py-2 rounded-lg shadow-md'>
                My Car
              </Button>
            </Link>
          </>
        ) : (
          <SignInButton>
            <Button className='bg-blue-500 text-white hover:scale-110 hover:bg-blue-600 transition-transform px-4 py-2 rounded-lg shadow-md'>
              Sign In
            </Button>
          </SignInButton>
        )}
      </div>
    </header>
  )
}

export default Header