


export interface attendance {
    name:string,
    status:"Present"|"Absent"
}

export async function attendance(course_id:number):Promise<attendance[]>{
    let start = fetch("/get_attendance" , {
        method:"POST" ,
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({course_id})
    });

    let data = (await start).json()
    let s:attendance[] = await data

    return s

}