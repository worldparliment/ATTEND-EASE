"use client"
import { attendance } from '@/app/(utility)/get_attendance'
import React, { useEffect, useState } from 'react'
import "./today.css"
import { decode } from '@/app/(utility)/decode'
import { useRouter } from 'next/navigation'
import Course_Name from '@/app/Component/add'
import Popup from '@/app/Component/pop-up'

export default function Page() {
  const [student, setStudent] = useState<attendance[]>([])
  const router = useRouter()
  const [isopen , setIsOpen] = useState(false)

  useEffect(() => {
    async function set_everything() {
      const token = localStorage.getItem("course_id")

      if (!token) {
        alert("Unauthorized access. Please log in.")
        router.push("/manage-students-login")
        return
      }

      try {
        const decoded = await decode(token)
        const courseAttendance = await attendance(decoded.course_id)
        setStudent(courseAttendance)
        console.log("Present students:", courseAttendance)
      } catch (err) {
        setIsOpen(true)
        setTimeout(()=>{router.push("/manage-students-login")} , 2000)
      }
    }

    set_everything()
  }, [])

  return (
    <div id='main-container-attendance'>
      <div id='active-course'>
        <h1>ACTIVE COURSE - <Course_Name/> </h1>
    
      </div>

      <div id="head-logoo">
        <img src='https://cdn-icons-png.flaticon.com/128/3602/3602172.png' />
        <h2>TODAY ATTENDANCE</h2>
      </div>

      <div id="attendance-table">
        <h3>PRESENT STUDENTS</h3>

        <div id='student-names'>
          {student.map((stud, index) => (
            <p id='cards' key={stud.name + index}>{stud.name.toUpperCase()}</p>
          ))}
        </div>
      </div>
      <Popup isOpen={isopen} onClose={()=>{setIsOpen(false)}} title='LOGIN FIRST'><p>PLEASE LOGIN INTO COURSE</p></Popup>
    </div>
  )
}
