



type STUDENTS_ATTENADNCE = {
    name:string,
    roll_no:string
    status:"PRESENT"|"ABSENT"
}



export async function get_all_attendance(course_id:number){
     
    let data = await fetch("http://localhost:3000/get_all_students" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            course_id: course_id
        })
    });
    let attendance = await data.json () as STUDENTS_ATTENADNCE[]



  console.log(attendance)




}