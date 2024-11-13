import { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import './App.scss'

//component imports
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Links from './components/Links'

import useCustomizer from './hooks/useCustomizer'

const App = () => {

  const {navColor} = useCustomizer();

  useEffect(() => {
    document.getElementById('navBar').style.backgroundColor = `${navColor}`;

  }, [navColor]);



  return (
    <HashRouter>
      <NavBar/>
      <Links/>
      <Footer/>
    </HashRouter>
  )
}

export default App
