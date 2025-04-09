"use client"

import { DELETE } from '@/app/(utility)/delete'
import './delete.css'
import { get_instant_course_name } from '@/app/(utility)/get_instant_course_name'
import React, { useEffect  , useState} from 'react'
import Popup from '@/app/Component/pop-up'




export default function page() {
   
    const [course_name, set_course_name] = React.useState('')
    const [roll_no, set_roll_no] = useState('')
    const [showPopup, setShowPopup] = useState(false);
    const [deleting, setdeleting] = useState(false);

    function handleRollNoChange(event: React.ChangeEvent<HTMLInputElement>) {
        set_roll_no(event.target.value);
    }

    async function deleteStudent(roll_no: string) {
        setdeleting(true);
         let start = await DELETE(roll_no);
          setdeleting(false);
        if (start.status === 200) {
           setShowPopup(true);
        }
    }

    useEffect(() => {
        const fetchCourseName = async () => {
            const course = await get_instant_course_name();
            console.log(course)
            if (course) {
                set_course_name(course);
            }
        };
        fetchCourseName();
    }, []);

  return (
   <div id='main'>
     <h1>ACTIVE COURSE-<span>{course_name}</span></h1>

     <div id='logo-text'>
        <img src='	https://cdn-icons-png.flaticon.com/128/8870/8870449.png' alt='logo' id='logo'/>
        <h2 id='text'>DELETE STUDENT</h2>
     </div>


       <input type='text' placeholder='roll no' id='input' onChange={handleRollNoChange} />
       <p>ENTER ROLL NO</p>

         <button id='btn' onClick={() => deleteStudent(roll_no)}>DELETE</button>
  
        

          <Popup isOpen={showPopup} onClose={()=>{setShowPopup(false)}} title='SUCESS :]'><p>DELETED STUDENT SUCESSFULLY</p></Popup>
          <Popup isOpen={deleting} onClose={()=>{setdeleting(false)}} title='WAIT :]'><p>DELETING ....</p></Popup>


         </div>

  )
}
