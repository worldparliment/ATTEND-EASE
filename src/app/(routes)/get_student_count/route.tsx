import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";




export async function POST (request:NextRequest) {
      let data = await request.json();
      let admin_id:any|undefined = data.admin_id;
      let course_id:any|undefined = data.course_id;
      let option = data.option;

      let college_url = "SELECT * FROM STUDENTS WHERE admin_id=?"
      let course_url = "SELECT * FROM STUDENTS WHERE course_id=?"

      if(option==="FOR_WHOLE_COLLEGE"){
           let [start] = await DB.query(college_url , [admin_id]);
           let total_students  = [start][0]
           return Response.json(total_students)
      }

      let [start] = await DB.query(course_url , [course_id]);
      return Response.json([start][0])
      
}