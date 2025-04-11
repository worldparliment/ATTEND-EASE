"use client";

import { get_super_admin_id } from "@/app/(utility)/get_super_admin_id";
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
        <title>ATTEND-EASE [UPDATE-STUDENT]</title>
        <link rel="icon" href="/sujal.svg" />
      <div
        id="aside-bar"

        style={{ transform: `translateX(${isSidebarOpen ? '0px' : '340px'})` }}
      >
        <div id="six-dots" style={{ borderBottom: isSidebarOpen ? 'none' : '1px solid black' }} onClick={openSidebar}>
          <img id="imgs" src={"https://i.ibb.co/PztSfc7Y/Component-1-2.png"} alt="Menu toggle" width={24} height={20} />
        </div>



        <div id="option-box">
          <Link href={"/add-course"}><h2 className="options">ADD COURSES</h2></Link>
            {/* <Link href={super_admin_id > 0 ? "/manage-students" : "/manage-students-login"}><h2 className="options">MANAGE STUDENTS</h2></Link> */}
          <Link href={"/manage-students"}><h2 className="options">MANAGE STUDENTS</h2></Link>
          <Link href={"/mark-attendance"}> <h2 className="options">MARK ATTENDANCE</h2></Link>
          {/* <Link href={"/search-student"}><h2 className="options">SEARCH STUDENT</h2></Link> */}
          <Link href={"/search-student"} className="options"><h2>SEARCH STUDENT</h2></Link>
          <Link href={"/today-attendance"}> <h2 className="options">TODAY'S ATTENDANCE</h2></Link>
          <Link href={"/dashboard"}> <h2 className="options">DASHBOARD</h2></Link>
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
