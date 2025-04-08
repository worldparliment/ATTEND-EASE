export async function get_student_count(option: string, course_id?: number, admin_id?: number){



    if (option === "FOR_WHOLE_COLLEGE") {



        let get_student_count_with_admin_id = await fetch("/get_student_count", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ admin_id, option })
        }) 



        return get_student_count_with_admin_id.json()

   
    }

    let get_student_count_with_course_id = await fetch("/get_student_count", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ course_id, option })
    }) 

    return get_student_count_with_course_id.json()





}