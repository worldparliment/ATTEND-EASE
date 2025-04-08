"use client"
import { attendance } from '@/app/(utility)/get_attendance'
import React, { useEffect, useState } from 'react'
import "./today.css"
import { decode } from '@/app/(utility)/decode'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [student, setStudent] = useState<attendance[]>([])
  const router = useRouter()

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
        console.error("Error decoding or fetching attendance:", err)
        alert("Session expired or invalid token. Please log in again.")
        router.push("/manage-students-login")
      }
    }

    set_everything()
  }, [])

  return (
    <div id='main-container-attendance'>
      <div id='active-course'>
        <h1>ACTIVE-COURSE</h1>
        <h1>BCA-2025</h1>
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
    </div>
  )
}
