"use client";

import React, { useEffect, useState, use } from "react";
import { Student } from "@/app/(utility)/search_students";
import { search_student } from "@/app/(utility)/search_students_by_roll_no";
import { decode } from "@/app/(utility)/decode";
import { useRouter } from "next/navigation";
import "./update.css";
import AttendancePDFButton from "@/app/Component/Attendancedownloadbutton";
import { fetchAttendancebyrollno } from "@/app/(utility)/get_attend_roll";
import { get_instant_course_name } from "@/app/(utility)/get_instant_course_name";
import Course_Name from "@/app/Component/add";

interface PageProps {
  params: Promise<{ roll_no: number }>; // important: now it's a Promise
}

export default function Page(props: PageProps) {
  const { roll_no } = use(props.params); // unwrap the promise
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    father_name: "",
    age: "",
    phone_no: "",
  });
  const router = useRouter();

  useEffect(() => {
    async function initialize() {
      
      try {
        const token = localStorage.getItem("course_id");
        if (!token) {
          alert("please login into course first");
          router.push("/manage-students-login");
          return;
        }

        const token_verification = await decode(token);
        if (!token_verification) {
          alert("unauthorized");
          router.push("/manage-students-login");
          return;
        }

        const studentData = await search_student(roll_no);

        if (studentData[0]) {
          setStudent(studentData[0]);
          setFormData({
            name: studentData[0].name,
            roll_no: studentData[0].roll_no.toString(),
            father_name: studentData[0].father_name,
            age: studentData[0].age.toString(),
            phone_no: studentData[0].phone_no,
          });
        }

        let count = await fetchAttendancebyrollno(Number(studentData[0]?.roll_no)) as any[];
        let attend = count.length;
        setAttendance(attend);
      } catch (error) {
        console.error("Error initializing:", error);
      }
    }

    initialize();
  }, [roll_no, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div id="ss">
      <h1 id="sa">ACTIVE COURSE - <Course_Name/></h1>
   
      <div id="stylish-card">
        <h1>{formData.name.toUpperCase()}</h1>

        <div id="card">
          <div id="labels-students">
            <h2>NAME</h2>
            <h2>ROLL NO</h2>
            <h2>FATHER NAME</h2>
            <h2>AGE</h2>
            <h2>PHONE</h2>
            <h2>ATTENDANCE</h2>
          </div>

          <div id="inputs-student">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              name="roll_no"
              value={formData.roll_no}
              onChange={handleInputChange}
            />
            <input
              name="father_name"
              value={formData.father_name}
              onChange={handleInputChange}
            />
            <input
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
            <input
              name="phone_no"
              value={formData.phone_no}
              onChange={handleInputChange}
            />
            <input value={attendance || 0} readOnly />
          </div>
        </div>

        <AttendancePDFButton
          props={{ roll_no: Number(formData.roll_no), name: formData.name }}
        />
      </div>
    </div>
  );
}
