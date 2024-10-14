import React from 'react'
import AdminListing from './AdminListing'
import AdminHeader from './AdminHeader'
import { Outlet } from 'react-router-dom'

const Layout:React.FC = () => {
    const heading = "Dashboard"
  return (
    <div>
       <div className='flex'>
           <AdminListing/>
           <div className="w-full  ml-16 md:ml-56 bg-[#DFECF8]">
             <AdminHeader heading={heading}/>
             <Outlet />
           </div>
       </div>
    </div>
  )
}

export default Layout

