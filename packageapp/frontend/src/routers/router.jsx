import {
    createBrowserRouter,
    //RouterProvider,
  } from "react-router-dom";

import App from "../App";
import Home from "../home/Home";
import Package from "../packages/Package";
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import UploadPackage from "../dashboard/UploadPackage";
import ManagePackage from "../dashboard/ManagePackage";
import EditPackage from "../dashboard/EditPackage";



  const router = createBrowserRouter([
    {
      path: "/",
      element:<App/>,
      children:[
        {
            path: '/',
            element:<Home/>
        },
        {
            path:"/package",
            element:<Package/>
        },
        {
          path:"/admin/dashboard",
          element:<DashboardLayout/>,
          children:[
            {
              path:"/admin/dashboard",
              element:<Dashboard/>
            },
            {
              path:"/admin/dashboard/upload",
              element:<UploadPackage/>
            },
            {
              path:"/admin/dashboard/manage",
              element:<ManagePackage/>
            },
            {
              path:"/admin/dashboard/edit/:id",
              element:<EditPackage/>,
              loader:({params}) => fetch(`http://localhost:5000/package/${params.id}`)
            }
          ]
        }
      ]
    },
  ]);

  export default router;