import { decode } from "./decode";


export async function getAllAttendanceByCourseIdForAll() {

   let course_id_token = localStorage.getItem("course_id");
   let course_id = await decode(course_id_token!);
   

   let start = await fetch("/all-attendance", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",},
         body: JSON.stringify({
            course_id: course_id.course_id,
            }),
            });
        
    return start.json();



}