"use client"

import  "./all.css"
import { COURSE_STUDENT, get_all_students_by_course } from '@/app/(utility)/get_course_students';
import { get_instant_course_name } from "@/app/(utility)/get_instant_course_name";
import React, { useEffect } from 'react'
import Link from 'next/link';

export default function page() {
   
   const [student , setStudent] = React.useState<COURSE_STUDENT[]>([])
   const [course , setCourse] = React.useState<string>("")
   
    useEffect(() => {
        const fetchCourseName = async () => {
            let course_name = await get_instant_course_name() as string
            setCourse(course_name)
           let start =  await get_all_students_by_course()
           setStudent(start)
        };
        fetchCourseName();
    }, []);


  return (
   
     <div id="main-all">
          <h1>ACTIVE COURSE-<span>{course}</span></h1>


          <div id="khyati"><img src="https://cdn-icons-png.flaticon.com/128/5110/5110777.png"/><h2>ALL STUDENTS</h2></div>

            <div id="all-student">
              
              {student.map((item , index) => {
                return (
                <div className="student" key={index}>
                    <Link href={`search/${Number(item.roll_no)}`}><h3>{item.name} -- {item.roll_no}</h3></Link>
                    
                  </div>
                )
              })}
              

            </div>



     </div>




  )
}
