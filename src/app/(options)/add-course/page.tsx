"use client";

import React, { useEffect, useState } from "react";
import "./add-course.css";
import { COURSE_DETAILS } from "@/app/(types)/types";
import "../../../../node_modules/augmented-ui/augmented-ui.min.css";
import { add_course } from "@/app/_Routesurl/urls";
import Popup from "@/app/Component/pop-up";
import { get_super_admin_id } from "@/app/(utility)/get_super_admin_id";

export default function Page() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [is_open , setIsOpen] = useState(false);
  const [courseDetail, setDetails] = useState({
    course_name: "",
    course_year: "",
    password: "",
    reenter_password: "",
  });
  const [adminId, setAdminId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAdminId() {
      try {
        const id = await get_super_admin_id();
        if (!id) {
          setIsOpen(true)

            setTimeout(() => {
            window.location.href = "/login";
            }, 3000);
          return;
        }
        setAdminId(id as number);
      } catch (error) {
        console.log("Error fetching super admin ID:", error);
       setIsOpen(true)
        setTimeout(() => {
          window.location.href = "/login";
          }, 3000);
      }
    }

    fetchAdminId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...courseDetail, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async () => {
    if (courseDetail.password !== courseDetail.reenter_password) {
      alert("Passwords do not match!");
      return;
    }

    const courseYear = Number(courseDetail.course_year);
    if (isNaN(courseYear)) {
      alert("Course year must be a number.");
      return;
    }

    const courseId = courseYear * 100 + Math.floor(Math.random() * 1000);
    const prepared: COURSE_DETAILS = {
      course_name: courseDetail.course_name,
      course_year: courseYear,
      password: courseDetail.password,
      course_id: courseId,
      admin_id: adminId ?? 0,
    };

    try {
      const response = await fetch(add_course, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prepared),
      });

      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      setIsPopupOpen(true);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div id="container-add-course">
      <div id="add-course-logo">
        <img src="https://cdn-icons-png.flaticon.com/128/3517/3517104.png" />
        <h1>ADD COURSES</h1>
      </div>

      <div id="course-form" data-augmented-ui="border tl-clip bl-clip br-clip tr-clip">
        <div id="fill-course">
          <h2>COURSE NAME</h2>
          <h2>COURSE YEAR</h2>
          <h2>PASSWORD</h2>
          <h2>REENTER-PASSWORD</h2>
        </div>
        <div id="fill-input">
          <input
            name="course_name"
            value={courseDetail.course_name}
            onChange={handleChange}
          />
          <input
            name="course_year"
            value={courseDetail.course_year}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            value={courseDetail.password}
            onChange={handleChange}
          />
          <input
            name="reenter_password"
            type="password"
            value={courseDetail.reenter_password}
            onChange={handleChange}
          />
        </div>
      </div>

      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="SUCCESS!">
        <p>{courseDetail.course_name} was added successfully!</p>
      </Popup>

      <Popup isOpen={is_open} onClose={() => setIsOpen(false)} title="LOGIN FIRST">
        <p>PLEASE LOGIN AS ADMIN FIRST</p>
      </Popup>


      <button id="add" onClick={handleAddCourse}>
        ADD
      </button>
    </div>
  );
}
