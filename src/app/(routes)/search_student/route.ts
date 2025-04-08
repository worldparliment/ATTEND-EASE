import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";
import { RowDataPacket } from 'mysql2';

interface StudentRow extends RowDataPacket {
    name: string;
    roll_no: string;
    age: number;
    phone_no: string;
    father_name: string;
    face_embeddings: Buffer;
}

export async function GET(request:NextRequest){
    try {
        const search_term = request.nextUrl.searchParams.get('search_term') || '';
        const search_pattern = `${search_term}%`;

        const query = "SELECT name, roll_no, age, face_embeddings, father_name, phone_no, course_id FROM STUDENTS WHERE name LIKE ?";
        const [results] = await DB.query(query, [search_pattern]);

        // Convert results and transform face_embeddings to number array
        const formattedResults = Array.isArray(results) ? (results as StudentRow[]).map((row) => ({
            ...row,
            face_embeddings: JSON.parse(Buffer.from(row.face_embeddings).toString())
        })) : [];
        
        return Response.json( formattedResults );
    } catch (error) {
        return Response.json({ error: 'Invalid request' }, { status: 400 });
    }
}




export async function POST (request:NextRequest) {
  let data = await request.json();
  let roll_no = data.roll_no;

  const query = "SELECT name, roll_no, age, face_embeddings, father_name, phone_no  FROM STUDENTS WHERE roll_no = ?";

  const [results] = await DB.query(query , [roll_no]);

  const formattedResults = Array.isArray(results) ? (results as StudentRow[]).map((row) => ({
    ...row,
    face_embeddings: JSON.parse(Buffer.from(row.face_embeddings).toString())
})) : [];

return Response.json(formattedResults)
}