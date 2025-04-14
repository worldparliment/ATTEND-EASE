import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let data = await request.json();
    let course_id = data.course_id;
    
    let query = `
    SELECT a.name, a.roll_number, COUNT(*) AS total_present
    FROM ATTENDANCE a
    JOIN STUDENTS s ON a.roll_number = s.roll_no
    WHERE a.status = 'Present' AND a.course_id = ?
    GROUP BY a.roll_number, a.name;
    `;
    
    let [start] = await DB.execute(query, [course_id]);
    
    return new Response(JSON.stringify(start))
}