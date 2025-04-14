"use client"


import { decode } from '@/app/(utility)/decode'
import React, { useState, useEffect } from 'react'
import "./manage-students.css"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Course_Name from '@/app/Component/add'

export default function Page() {
  const [course_id, setCourseid] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function get_id() {
      const token = localStorage.getItem("course_id")

      console.log("📦 Token from localStorage:", token)

      if (!token) {
        console.warn("⚠️ No token found. Redirecting.")
        router.push("/manage-students-login")
        return
      }

      try {
        const decoded = await decode(token)
        console.log("✅ Decoded token:", decoded)

        if (!decoded || !decoded.course_id) {
          throw new Error("Decoded token missing course_id")
        }

        setCourseid(decoded.course_id)
      } catch (error) {
        console.error("❌ Failed to decode token:", error)
        router.push("/manage-students-login")
      } finally {
        setLoading(false)
      }
    }

    get_id()
  }, [router])

  if (loading) return <p style={{ textAlign: 'center' }}>Loading course info...</p>

  if (course_id === null) return null

  return (
    <div id="space">
      <h1>ACTIVE COURSE   -  <Course_Name/></h1>
   
      <div id="main-container">
        <div id="main-header">
          <h2>WHAT WOULD YOU LIKE TO DO</h2>
        </div>
        <div id="options-todo">
          <div className="todo"><Link href={"/add-student"}><h2>ADD STUDENT</h2></Link></div>
          <div className="todo"><Link href={"delete-students"}><h2>DELETE STUDENT</h2></Link></div>
          <div className="todo"><Link href={"/update-details"}><h2>UPDATE DETAILS</h2></Link></div>
          <div className="todo"><Link href={"/search-student"}><h2>SEARCH STUDENT</h2></Link></div>
          <div className="todo"><Link href={"/all-students-in-course"}><h2>ALL STUDENTS</h2></Link></div>
          <div className="todo"><Link href={"/manage-students-login"}><h2>CHANGE COURSE</h2></Link></div>
          <div className="todo"><Link href={"/all_attendance"}><h2>ALL ATTENDANCE </h2></Link></div>

        </div>
      </div>
    </div>
  )
}
