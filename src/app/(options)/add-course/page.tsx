"use client"

import React from 'react'
import "./add-course.css"
import { useState } from 'react'
import { COURSE_DETAILS } from '@/app/(types)/types';
import "../../../../node_modules/augmented-ui/augmented-ui.min.css";
import { add_course } from '@/app/_Routesurl/urls';
import Popup from '@/app/Component/pop-up';

export default function page() {


    const [isPopupOpen, setIsPopupOpen] = useState(false);

   const [Course_detail , Setdetails] = useState({course_name:"" , course_year:"", password:"" , reenter_password:""});

   function HandelChange (e:React.ChangeEvent<HTMLInputElement>){
       Setdetails({...Course_detail , [e.target.name]:e.target.value})
   }
   
   let course_year = Number(Course_detail.course_year)
   let course_name = Course_detail.course_name;
   let password = Course_detail.password
   let course_id = course_year * 100 + Math.floor(Math.random() * 1000); // Generate a random course ID
   let admin_id = 5;

   let prepared : COURSE_DETAILS = {course_name , course_year , password , course_id , admin_id}

   console.log(prepared)
   
   async function add () {
    try {
      let response = await fetch(add_course, {
        method: "POST",
        headers: {
           "Content-Type": "application/json"
        },
        body: JSON.stringify({...prepared})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      let result = await response.json();
      console.log(result);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error:', error);
    }
   }



 

  return (
    <div id="container-add-course">
        <div id="add-course-logo"><img src='https://cdn-icons-png.flaticon.com/128/3517/3517104.png'/> <h1>ADD COURSES</h1></div>
        <div id="course-form" data-augmented-ui="border tl-clip bl-clip br-clip tr-clip">
            <div id="fill-course">
                <h2>COURSE NAME</h2>
                <h2>COURSE YEAR</h2>
                <h2>PASSWORD</h2>
                <h2>REENTER-PASSWORD</h2>
            </div>
            <div id="fill-input">
                  <input name='course_name' value={Course_detail.course_name} onChange={HandelChange}/>
                  <input name='course_year' value={Course_detail.course_year} onChange={HandelChange}/>
                  <input name='password' value={Course_detail.password} onChange={HandelChange}/>
                  <input name='reenter_password' value={Course_detail.reenter_password} onChange={HandelChange}/>
            </div>
        </div>
        <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="SUCESS!">
        <p>{course_name} IS ADDED SUCESSFULLY</p>
      </Popup>
        <button id="add" onClick={add}>ADD</button>
    </div>
  )
}
