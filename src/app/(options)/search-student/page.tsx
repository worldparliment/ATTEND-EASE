"use client"
import React, { useEffect, useState } from 'react'
import { search_student, Student } from '@/app/(utility)/search_students'
import "./search-student.css"
import Popup from '@/app/Component/pop-up'
import Link from 'next/link'
import { decode } from '@/app/(utility)/decode'
import { get_course_name } from '@/app/(utility)/get_course_name'
import { useRouter } from 'next/navigation'
import Course_Name from '@/app/Component/add'

export default function Page() {
  const [students, setStudents] = useState<Student[]>([])
  const [name, setName] = useState("")
  const [isSearching, setSearching] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [courseName, setCourseName] = useState("")
  const [is_open, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("course_id")

      if (!token) {
        setIsOpen(true)
        return
      }

      try {
        const decoded = await decode(token)
        const course_id = decoded.course_id

        const name = await get_course_name(course_id)
        setCourseName(name as string)
      } catch (err) {
        console.log("Token error:", err)
        setIsOpen(true)
      }
    }

    verify()
  }, [])

  // ✅ Only redirect when user closes the popup manually
  const handlePopupClose = () => {
    setIsOpen(false)
    router.push("/manage-students-login")
  }

  async function stud(name: string) {
    setSearching(true)
    try {
      const results = await search_student(name)
      console.log("All Students Found:", results)
      setStudents(results)

      if (results.length > 0) {
        setShowModal(true)
      } else {
        alert("No student found!")
        setShowModal(false)
      }
    } catch (error) {
      console.log("Error:", error)
    } finally {
      setSearching(false)
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  function handleSearchClick() {
    stud(name)
  }

  return (
    <div id="main-c">
      <div id="header-search-student">
        <h1>ACTIVE COURSE - <Course_Name /></h1>
       

        <div id="main-conatiner-search">
          <div id="head-logo">
            <img src='https://cdn-icons-png.flaticon.com/128/54/54481.png' />
            <h2>SEARCH STUDENT</h2>
          </div>

          <div id="search">
            <input name='search' onChange={handleInput} />
            <h3>ENTER THE NAME OF STUDENT</h3>
            <button id='search-btn' onClick={handleSearchClick}>SEARCH</button>
          </div>
        </div>
      </div>

      {/* Modal for student details */}
      <Popup isOpen={showModal} onClose={() => setShowModal(false)} title="STUDENT DETAILS">
        <div className="modal-student-container">
          {students.map((student, index) => (
            <Link
              href={`/search/${student.roll_no}`}
              key={index}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="student-card">
                <h2>{student.name}</h2>
                <p><strong>Roll No:</strong> {student.roll_no}</p>
                <p><strong>Age:</strong> {student.age}</p>
                <p><strong>Phone No:</strong> {student.phone_no}</p>
                <p><strong>Father's Name:</strong> {student.father_name}</p>
              </div>
            </Link>
          ))}
        </div>
      </Popup>

      {/* Searching popup */}
      <Popup isOpen={isSearching} onClose={() => setSearching(false)} title="SEARCHING STUDENT">
        <p>BE PATIENT ;)</p>
      </Popup>

      {/* Login required popup */}
      <Popup isOpen={is_open} onClose={handlePopupClose} title="PLEASE LOGIN FIRST">
        <p>YOU HAVE NO COURSE LOGIN</p>
      </Popup>
    </div>
  )
}
