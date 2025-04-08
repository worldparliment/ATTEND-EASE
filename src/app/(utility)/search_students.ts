
export interface Student{
    name: string;
    roll_no: string;
    age: number;
    phone_no: string;
    father_name: string;
    face_embeddings: Buffer;
}




export async function search_student(name:string): Promise<Student[]> {
  
    let url = `http://localhost:3000/search_student?search_term=${name}`;


    let start = await fetch (url , {
         method:"GET",
         headers:{
            "Content-Type" : "application/json"
         }
    })
    

    let Student_array = await start.json()


   return Student_array



}