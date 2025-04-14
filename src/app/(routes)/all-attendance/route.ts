import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let data = await request.json();
    let course_id = data.course_id;
    
    let query = `
  SELECT 
    s.name, 
    s.roll_no AS roll_number, 
    COUNT(CASE WHEN a.status = 'Present' AND a.course_id = ? THEN 1 END) AS total_present
FROM 
    STUDENTS s
LEFT JOIN 
    ATTENDANCE a ON s.roll_no = a.roll_number
GROUP BY 
    s.roll_no, s.name;
    `;
    
    let [start] = await DB.execute(query, [course_id]);
    
    return new Response(JSON.stringify(start))
}