import { decode } from "./decode";



export interface COURSE_STUDENT {
    name: string;
    roll_no: string;
}

export async function get_all_students_by_course() {
       const token = localStorage.getItem('course_id');
       const decoded = await decode(token as string) ;
       const course_id = decoded.course_id;
   try {
       let data = await fetch('/get_student_count', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                course_id: course_id,
                option: 'FOR_COURSE'
              }),
         });

        let result = await data.json();
        let students:COURSE_STUDENT[] = result.map((student:COURSE_STUDENT) => {
            return {
                name: student.name,
                roll_no: student.roll_no
            }
        }
        )
        return students;
   } catch (error) {
       console.error("Error fetching students:", error);
       return [];
   }





}