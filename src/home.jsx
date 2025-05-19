import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Category from './components/Category'
import MostSearchedCar from './components/MostSearchedCar'
import InfoSection from './components/InfoSection'
import Footer from './components/Footer'
import { checkUserInDb } from './Shared/Service'

function Home() {
  checkUserInDb(); //kiểm tra người dùng trong DB

  return (
    <div>
      {/*<Header /> */}
      <Header />

      {/*<Hero /> */}
      <Hero />

      {/*<Category/> */}
      <Category />

      {/*<MostSearchedCar /> */}
      <MostSearchedCar />

      {/*<InfoSection /> */}
      <InfoSection />

      {/*<Footer /> */}
      <Footer />

    </div>
  )
}

export default Home