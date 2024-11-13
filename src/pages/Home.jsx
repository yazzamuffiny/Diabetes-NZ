import React from 'react'
import PageHeader from '../components/PageHeader'
import HomeEvents from '../components/HomeEvents'
import HomeNews from '../components/HomeNews'
import Subscribe from '../components/Subscribe'

//seo
import Seo from '../components/Seo'

const Home = () => {
  return (
    <>
    <Seo
      title='Home - Diabetes NZ'
      description='Diabetes New Zealand provides support, education, and resources to help individuals manage diabetes and improve quality of life. Join our community for expert advice, advocacy, and up-to-date information on living with diabetes.'
      url={window.location.href}
    />
      <PageHeader image_url='/header-imgs/home.jpg'/>
      <div className='home-page'>
        <h2>Events</h2>
        <HomeEvents/>
        <HomeNews/>
        <Subscribe/>
      </div>
      
    </>
  )
}

export default Home
