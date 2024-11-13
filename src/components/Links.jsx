import React from 'react'
import { Route, Routes } from 'react-router-dom'

//page imports
import Home from '../pages/Home'
import News from '../pages/News'
import Recipes from '../pages/Recipes'
import Events from '../pages/Events'
import Education from '../pages/Education'
import Support from '../pages/Support'
import Donations from '../pages/Donations'

//single page imports
import Article from '../singlepages/Article'
import EducationalInfo from '../singlepages/EducationalInfo'
import Event from '../singlepages/Event'
import Recipe from '../singlepages/Recipe'
import SupportPost from '../singlepages/SupportPost'

const Links = () => {

  return (
    <Routes>
        {/* home route */}
        <Route exact path='/' element={<Home/>}/>
        {/* pages route */}
        <Route path='/news' element={<News/>}/>
        <Route path='/recipes' element={<Recipes/>}/>
        <Route path='/events' element={<Events/>}/>
        <Route path='/education' element={<Education/>}/>
        <Route path='/support' element={<Support/>}/>
        <Route path='/donate' element={<Donations/>}/>
        {/* single page routes */}
        <Route path='/news/:id' element={<Article/>}/>
        <Route path='/education/:id' element={<EducationalInfo/>}/>
        <Route path='/events/:id' element={<Event/>}/>
        <Route path='/recipes/:id' element={<Recipe/>}/>
        <Route path='/support/:id' element={<SupportPost/>}/>
    </Routes>
  )
}

export default Links
