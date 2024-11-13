import React from 'react'

//icons import
import { FaRegCopyright } from "react-icons/fa";
import { AiOutlineFacebook } from "react-icons/ai";
import { AiOutlineInstagram } from "react-icons/ai";
import { AiOutlineYoutube } from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className='footer-logo-container'>
        <img src='./logo.png' alt="Diabetes New Zealand Logo" className='footer-logo'/>
        <span><FaRegCopyright /> 2024 Diabetes NZ All rights reserved </span>
        <p>Terms of Service</p>
        <p>Privacy Policy</p>
      </div>
      <div className='footer-links'>
        <div className='footer-links-container'>
          <h5>Social</h5>
          <ul>
            <li className='footer-link'>
            <a href='https://www.facebook.com/diabetesnz/' target='blank'><AiOutlineFacebook /> Facebook</a>
            </li>
            <li className='footer-link'>
              <a href='https://www.instagram.com/diabetes_nz/' target='blank'><AiOutlineInstagram /> Instagram</a>
            </li>
            <li className='footer-link'>
            <a href='https://www.youtube.com/@diabetesnz8725' target='blank'><AiOutlineYoutube /> Youtube</a>
            </li>
          </ul>
        </div>
        <div className='footer-links-container'>
          <h5>About</h5>
          <ul>
            <li className='footer-link'>
              Contact
            </li>
            <li className='footer-link'>
              About Us
            </li>
            <li className='footer-link'>
              Site Map
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
