'use client'


import React, { useState } from 'react';
import "./manage-login.css"
import { get_super_admin_id } from '@/app/(utility)/get_super_admin_id';
import { get } from 'http';
import { get_courses } from '@/app/(utility)/get_courses';

interface Course {
  course_name: string;
}

export default function page() {
  const [courses , setCourses] = useState<Course[]>([]);
  const [SUPER_ADMIN_ID , setAdminId] = useState(0);
   
  React.useEffect(() => {
    async function get_admin_id(){
      let id = await get_super_admin_id();
      let course = await get_courses(id as number);
      setCourses(course as []);
      console.log(course);
      setAdminId(id as number);
    }

    get_admin_id();
  }, []); // Empty dependency array means this effect runs once when component mounts
  


  console.log(courses);
    

  return (
    <div id="container-manage-students-login">
       
     <div id="header-manage-students-login"><img src="https://cdn-icons-png.flaticon.com/128/8920/8920519.png"/> <h1>MANAGE STUDENTS</h1></div>
        
       <div id="manage-student-login-form">
         
         <h4>LOGIN INTO THE COURSE BEFORE MANAGE STUDENTS</h4>
               
               <div id="manage-student-login-form-input"> 
                    
                    <div id='manage-students-login-lables'>
                      <h3>SELECT-COURSE</h3>
                      <h3>PASSWORD</h3>
                    </div>
                    <div id='manage-students-login-inputs'>
                         <select defaultValue={"select-course"} id="select-course">
                         <option value="select-course" disabled>Select Course</option>
                         {courses.map((course, index) => (
                           <option key={index} value={course.course_name}>
                           {course.course_name}
                           </option>
                         ))}
                         </select>
                         <input  id="password" placeholder='Enter Password'/>
                    </div>
   
               </div>
 
       </div>
 

       <button id='sumbit'>SUMBIT</button>
    </div>
  )
}
