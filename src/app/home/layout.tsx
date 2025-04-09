"use client";


import "./dashboard.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Changed to boolean



  function openSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Sidebar Open:", !isSidebarOpen);
  }
   
  



  return (
    <div id="container-1">
      <div
        id="aside-bar"

        style={{ transform: `translateX(${isSidebarOpen ? '0px' : '340px'})` }}
      >
        <div id="six-dots" style={{ borderBottom: isSidebarOpen ? 'none' : '1px solid black' }} onClick={openSidebar}>
          <img id="imgs" src={"https://i.ibb.co/PztSfc7Y/Component-1-2.png"} alt="Menu toggle" width={24} height={20} />
        </div>



        <div id="option-box">
          <Link href={"/registration"}><h2 className="options">REGISTER</h2></Link>
            {/* <Link href={super_admin_id > 0 ? "/manage-students" : "/manage-students-login"}><h2 className="options">MANAGE STUDENTS</h2></Link> */}
          <Link href={"/login"}><h2 className="options">LOGIN</h2></Link>

        </div>



      </div>

      <div id="container-2">

        <div id="navbar-dashboard">
          <div id="text-with-logo-dashboard">
            <img
              src="https://cdn-icons-png.flaticon.com/128/10807/10807985.png"
              alt="ATTEND-EASE logo"
            />
            <h2><span id="logo-text-span-dashboard">ATTEND-</span>EASE</h2>
          </div>
        </div>

        {children}


      </div>
    </div>



  )
};
