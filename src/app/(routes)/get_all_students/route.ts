import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";


export async function POST (request:NextRequest) {
    let data = await request.json();
    let course_id = data.course_id;

   const [rows] = await DB.query("SELECT * FROM ATTENDANCE WHERE course_id = 1" , [course_id]);
   const students = rows as any[];


   return Response.json(students);

}