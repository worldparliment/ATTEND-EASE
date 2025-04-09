import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { roll_no, course_id } = body;
  
      // Validate input
      if (!roll_no || !course_id) {
        return new Response(JSON.stringify({ error: 'roll_no and course_id are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
    
      const values = [roll_no  , course_id];
      const result = await DB.execute(
        'DELETE FROM STUDENTS WHERE roll_no = ? AND course_id = ?',
        values
      );
  
      return new Response(JSON.stringify({ message: 'Student deleted successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }