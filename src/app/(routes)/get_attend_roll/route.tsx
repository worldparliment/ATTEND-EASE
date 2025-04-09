import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    try {
      const { roll_no } = await req.json();
  
      if (!roll_no) {
        return new Response(JSON.stringify({ error: 'Missing student_id' }), { status: 400 });
      }

      const [rows] = await DB.execute(
        'SELECT date, status FROM ATTENDANCE WHERE roll_number = ?',
        [roll_no]
      );
  
      await DB.end();
  
      return new Response(JSON.stringify(rows ), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
  
    } catch (error) {
      console.error('API error:', error);
      return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }