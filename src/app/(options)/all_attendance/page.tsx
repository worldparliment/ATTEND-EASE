"use client";

import { getAllAttendanceByCourseIdForAll } from "@/app/(utility)/get_all_attendance_by_course_id_for_all";
import "./all-attendance.css";
import Course_Name from "@/app/Component/add";
import { useState, useEffect } from "react";

export default function AllAttendance() {
   
    interface AttendanceData {
      roll_number: number, 
      total_present: number,  // Changed from total_presents to match your API response
      name: string,
    }

    const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            let course_data = await getAllAttendanceByCourseIdForAll();
            setAttendanceData(course_data);
        };
        fetchAttendanceData();
    }, []);

    console.log(attendanceData);

    return (
        <div id="main-container-all-attendance">
            
          <h1 id="ask">ACTIVE COURSE - <Course_Name></Course_Name></h1>  

          <div className="attendance-table">
             
             <div id="names"> 
                 <h3>NAME</h3>
                 {
                   attendanceData.map((data, index) => (
                     <div key={`name-${data.roll_number}-${index}`} className="name-card">{data.name}</div>
                   ))
                 }
             </div>

             <div id="roll_no">
                <h3>ROLL_NO</h3>
                { 
                  attendanceData.map((data, index) => (
                    <div key={`roll-${data.roll_number}-${index}`} className="roll-card">{data.roll_number}</div>
                  ))
                } 
             </div>

             <div id="total-presents">
                <h3>TOTAL PRESENT</h3>
                { 
                  attendanceData.map((data, index) => (
                    <div key={`total-${data.roll_number}-${index}`} className="total-present">{data.total_present}</div>
                  ))
                } 
             </div>
          </div>
        </div>
    );
}