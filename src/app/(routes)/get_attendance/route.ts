import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";




export async function POST (request:NextRequest){
     let data = await request.json()
     let course_id = data.course_id;

    let query = "SELECT name, status FROM ATTENDANCE WHERE course_id=? AND date=CURRENT_DATE()"


    let [start] = await DB.query(query , [course_id]);

    return Response.json([start][0]);


}