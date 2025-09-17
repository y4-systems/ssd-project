//import React from 'react'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className='flex gap-8 flex-col md:flex-row'>
      <SideBar/>
      <Outlet/>
    </div>
  )
}

export default DashboardLayout;
