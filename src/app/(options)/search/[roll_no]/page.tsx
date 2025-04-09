"use client"

import React, { useEffect, useState, use } from "react";
import { Student } from "@/app/(utility)/search_students";
import { search_student } from "@/app/(utility)/search_students_by_roll_no";
import { decode } from "@/app/(utility)/decode";
import { useRouter } from "next/navigation";
import "./update.css"
import AttendancePDFButton from "@/app/Component/Attendancedownloadbutton";

interface PageProps {
  params: Promise<{ roll_no: number }>; // important: now it's a Promise
}

export default function Page(props: PageProps) {
  const { roll_no } = use(props.params); // unwrap the promise
  const [student, setStudent] = useState<Student | null>(null);
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
        setStudent(studentData[0] || null);
      } catch (error) {
        console.error("Error initializing:", error);
      }
    }

    initialize();
  }, [roll_no, router]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
          <h1>ACTIVE COURSE</h1>
          <h1>BCA-2025</h1>
          <div id="stylish-card">

               <h1>{student.name.toUpperCase()}</h1>  
              
                    
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
                     <input value={student.name}/>
                     <input value={student.roll_no}/>
                     <input value={student.father_name}/>
                     <input value={student.age}/>
                     <input value={student.phone_no}/>
                     <input value={121}/>
                  </div>



              </div>



      <AttendancePDFButton/>


          </div>
    </div>
  );
}
