'use client'

import React, { useState, useEffect } from 'react';
import "./manage-login.css";
import { get_super_admin_id } from '@/app/(utility)/get_super_admin_id';
import { get_courses } from '@/app/(utility)/get_courses';
import { useRouter } from 'next/navigation';
import { get_token_for_course } from '@/app/(utility)/get_token_for_course';

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

  useEffect(() => {
    async function fetchData() {
      try {
        const id = await get_super_admin_id();
        if (id === undefined) {
          window.location.href = "/login";
          throw new Error("Super admin ID is undefined");
        }
        const courseList = await get_courses(id);
        setCourses(courseList);
      } catch (error) {
        console.error("❌ Failed to fetch courses:", error);
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
          throw new Error("Invalid token received");
        }

        console.log("✅ Token:", token);
        localStorage.setItem("course_id", token);
        router.push("/manage-students");
      } catch (error) {
        console.error("❌ Error getting token:", error);
        alert("Failed to login. Please try again.");
      }
    } else {
      alert("Invalid course or password.");
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

      <button id="sumbit" onClick={login_into_course}>SUBMIT</button>
    </div>
  );
}
