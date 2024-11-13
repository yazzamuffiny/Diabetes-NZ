import { useState } from 'react'
import { NavLink } from 'react-router-dom'



const NavBar = () => {

  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
  }

const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  }


  return (
    <header>
      <nav className={`navbar ${isOpen ? 'menu-open' : ''}`} id='navBar'>
        
        <NavLink to='/' className='logo'>
          <img src='./logo-white.png' alt='Diabetes New Zealand Logo' className='navbar-logo'/>
        </NavLink>

        {/* hamburg */}
        <div className='menu-icon' onClick={toggleMenu}>
          <div className={`bar bar1 ${isOpen ? 'toggle' : ''}`}></div>
          <div className={`bar bar2 ${isOpen ? 'toggle' : ''}`}></div>
          <div className={`bar bar3 ${isOpen ? 'toggle' : ''}`}></div>
        </div>

        {/* site links */}
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          {/* home */}
          <li>
            <NavLink
              to='/'
              onClick={closeMenu}
              className={({isActive}) => (isActive ? 'active-link' : '')}
            >
              Home
            </NavLink>
          </li>
          {/* news */}
          <li>
            <NavLink
              to='/news'
              onClick={closeMenu}
              className={({isActive}) => (isActive ? 'active-link' : '')}
            >
              News
            </NavLink>
          </li>
          {/* recipes */}
          <li>
            <NavLink
              to='/recipes'
              onClick={closeMenu}
              className={({isActive}) => (isActive ? 'active-link' : '')}
            >
              Recipes
            </NavLink>
          </li>
          {/* events */}
          <li>
            <NavLink
              to='/events'
              onClick={closeMenu}
              className={({isActive}) => (isActive ? 'active-link' : '')}
            >
              Events
            </NavLink>
          </li>
          {/* education */}
          <li>
            <NavLink
              to='/education'
              onClick={closeMenu}
              className={({isActive}) => (isActive ? 'active-link' : '')}
            >
              Education
            </NavLink>
          </li>
          {/* support */}
          <li>
            <NavLink
              to='/support'
              onClick={closeMenu}
              className={({isActive}) => (isActive ? 'active-link' : '')}
            >
              Support
            </NavLink>
          </li>
           {/* donate */}
           <li>
            <NavLink
              to='/donate'
              onClick={closeMenu}
              className={({isActive}) => (isActive ? 'active-link' : '')}
            >
              Donate
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
