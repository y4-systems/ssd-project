import React from 'react'
import { FaBell, FaUserCircle } from 'react-icons/fa'
import './navbar.css'

const NavBar = () => {
  return (
    <nav className='nav-bar-container'>
      <div className='nav-bar-left'>
        <span>
          Finance Manager Dashboard
        </span>
      </div>

      <div className='nav-bar-right'>
        <span>Admin Panel</span>
        <FaBell className='icons-right'/>
        <FaUserCircle className='icons-right'/>
      </div>

    </nav>
  )
}

export default NavBar