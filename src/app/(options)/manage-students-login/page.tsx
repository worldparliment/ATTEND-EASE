'use client'

import React, { useState, useEffect } from 'react';
import "./manage-login.css";
import { get_super_admin_id } from '@/app/(utility)/get_super_admin_id';
import { get_courses } from '@/app/(utility)/get_courses';
import { useRouter } from 'next/navigation';
import { get_token_for_course } from '@/app/(utility)/get_token_for_course';
import Popup from '@/app/Component/pop-up';


interface Course {
  course_name: string;
  course_password: string;
  course_id: number;
}

export default function Page() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [password, setPassword] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [is_open , setIsOpen] = useState(false);
  const [invalid , setinvalid] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const id = await get_super_admin_id();
        if (id === undefined) {
          setIsOpen(true);
          setTimeout(() => {
            window.location.href = "/login";
            }, 2000);
          console.log("Super admin ID is undefined");
        }
        const courseList = await get_courses(id as number);
        setCourses(courseList);
      } catch (error) {
        console.log("❌ Failed to fetch courses:", error);
      }
    }
    fetchData();
  }, []);

  async function login_into_course() {
    if (!selectedCourseName || !password) {
      alert("Please select a course and enter the password.");
      return;
    }

    const selectedCourse = courses.find(course =>
      course.course_name === selectedCourseName && course.course_password === password
    );

    if (selectedCourse) {
      try {
        const token = await get_token_for_course(selectedCourse.course_id);

        if (!token || typeof token !== "string") {
          console.log("Invalid token received");
        }

        console.log("✅ Token:", token);
        localStorage.setItem("course_id", token);
        router.push("/manage-students");
      } catch (error) {
        console.log("❌ Error getting token:", error);
        alert("Error getting token. Please try again.");
      }
    } else {
      setinvalid(true);
    }
  }

  return (
    <div id="container-manage-students-login">
      <div id="header-manage-students-login">
        <img src="https://cdn-icons-png.flaticon.com/128/8920/8920519.png" />
        <h1>MANAGE STUDENTS</h1>
      </div>

      <div id="manage-student-login-form">
        <h4>LOGIN INTO THE COURSE BEFORE MANAGE STUDENTS</h4>

        <div id="manage-student-login-form-input">
          <div id="manage-students-login-lables">
            <h3>SELECT COURSE</h3>
            <h3>PASSWORD</h3>
          </div>

          <div id="manage-students-login-inputs">
            <select
              defaultValue={"select-course"}
              id="select-course"
              onChange={(e) => setSelectedCourseName(e.target.value)}
            >
              <option value="select-course" disabled>Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course.course_name}>
                  {course.course_name}
                </option>
              ))}
            </select>

            <input
              id="password"
              placeholder="Enter Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Popup isOpen={is_open} onClose={() => setIsOpen(false)} title={"PLEASE LOGIN AS ADMIN"}>
        <p>PLEASE LOGIN FIRST</p>
      </Popup>

      <Popup isOpen={invalid} onClose={() => setinvalid(false)} title={"OPPS!"}>
        <p>WRONG PASSOWRD   :(  </p>
      </Popup>

      <button id="sumbit" onClick={login_into_course}>SUBMIT</button>
    </div>
  );
}
