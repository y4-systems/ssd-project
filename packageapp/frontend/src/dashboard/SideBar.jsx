//import React from 'react'
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiOutlineCloudUpload, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";


const SideBar = () => {
  return (
  <Sidebar aria-label="Sidebar with content separator example" style={{marginTop:'100px' , marginLeft: '30px'}}>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/package" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>

          <Sidebar.Item href="/admin/dashboard/upload" icon={HiOutlineCloudUpload}>
            Upload Package
          </Sidebar.Item>

          <Sidebar.Item href="/admin/dashboard/manage" icon={HiInbox}>
            Manage Packages
          </Sidebar.Item>
          
         {/* <Sidebar.Item href="#" icon={HiUser}>
            Users
          </Sidebar.Item>

          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>*/}

          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Log Out
          </Sidebar.Item>

         {/* <Sidebar.Item href="#" icon={HiTable}>
            Log Out
        </Sidebar.Item> */}

        </Sidebar.ItemGroup>
        {/*<Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Upgrade to Pro
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiViewBoards}>
            Documentation
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={BiBuoy}>
            Help
          </Sidebar.Item>
        </Sidebar.ItemGroup>*/}
      </Sidebar.Items>
      
    </Sidebar>
  )
}

export default SideBar
