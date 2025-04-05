"use client"

import React, { useEffect, useState } from 'react'
import "./add-student.css"
import Link from 'next/link'
import { get_super_admin_id } from '@/app/(utility)/get_super_admin_id'
import { get_courses } from '@/app/(utility)/get_courses'
import getFaceEmbedding from '@/app/(utility)/get_face_emdedding'

type Course = {
  course_id: number,
  course_name: string,
}

export default function Page() {
  const [super_admin_id, setSuperAdminId] = useState<number | null>(null)
  const [course_id, setCourseId] = useState<number | null>(null)
  const [faceAvailable, setFaceAvailable] = useState(false)

  const [student, setStudent] = useState({
    name: "",
    age: "",
    roll_no: "",
    father_name: "",
    phone_no: "",
    course_id: 0,
    admin_id: 0,
    face_embeddings: null as any,
  })

  // Load face embedding if it's already stored
  useEffect(() => {
    const storedEmbedding = getFaceEmbedding()
    if (storedEmbedding) {
      setStudent(prev => ({
        ...prev,
        face_embeddings: JSON.parse(storedEmbedding),
      }))
      setFaceAvailable(true)
    }
  }, [])

  // Fetch super_admin_id and active course on load
  useEffect(() => {
    async function fetchIds() {
      const adminId = await get_super_admin_id()
      setSuperAdminId(adminId as number)

      const courses: Course[] = await get_courses(adminId as number)
      if (courses.length > 0) {
        setCourseId(courses[0].course_id)
      }
    }

    fetchIds()
  }, [])

  // Update input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    })
  }

  // Handle register click
  async function handleregister() {
    if (
      !student.name || !student.age || !student.roll_no ||
      !student.father_name || !student.phone_no ||
      !student.face_embeddings || !super_admin_id || !course_id
    ) {
      alert("Please fill all fields and scan face.")
      return
    }

    const res = await fetch("/add_students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...student,
        admin_id: super_admin_id,
        course_id: course_id,
      }),
    })

    const data = await res.json()
    alert(data.message)

    if (res.ok) {
      localStorage.removeItem("face_embedding")
      setFaceAvailable(false)
    }
  }

  return (
    <div>
      <h1>ACTIVE COURSE - <span>BCA</span></h1>
      <span><h1>2025</h1></span>

      <div id="add-student-logo-text">
        <img src="https://cdn-icons-png.flaticon.com/128/7218/7218044.png" alt="logo" id="add-student-logo" />
        <h1 id="add-student-text">ADD STUDENTS</h1>
      </div>

      <div id="add-student-form">
        <div id="wrappers">
          <div id="add-student-form-lables">
            <h2>NAME</h2>
            <h2>AGE</h2>
            <h2>ROLL NO</h2>
            <h2>FATHER'S NAME</h2>
            <h2>PHONE NO</h2>
          </div>

          <div id="add-student-form-inputs">
            <input type="text" placeholder="Enter Name" name="name" id="add-student-input" onChange={handleChange} disabled={!faceAvailable} />
            <input type="text" placeholder="Enter Age" name="age" id="add-student-input" onChange={handleChange} disabled={!faceAvailable} />
            <input type="text" placeholder="Enter Roll No" name="roll_no" id="add-student-input" onChange={handleChange} disabled={!faceAvailable} />
            <input type="text" placeholder="Enter Father's Name" name="father_name" id="add-student-input" onChange={handleChange} disabled={!faceAvailable} />
            <input type="text" placeholder="Enter Phone No" name="phone_no" id="add-student-input" onChange={handleChange} disabled={!faceAvailable} />
          </div>
        </div>

        <Link href="./face-scan" id="add">
           <img src ="https://cdn-icons-png.flaticon.com/128/15742/15742687.png" alt="add" id="add-student-add-icon" />
           <h1>CLICK HERE TO ADD FACE</h1>
            <p>FIRST ADD FACE THEN YOU WILL ABLE TO FILL THE FORM</p>
        </Link>

      </div>

      <div id="add-student-register-button">
        <button onClick={handleregister} id="add-student-register" disabled={!faceAvailable}>REGISTER</button>
      </div>
    </div>
  )
}
