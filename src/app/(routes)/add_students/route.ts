import DB from "@/app/(db)/db";
import { add_student_sql } from "@/app/(utility)/sql_queries";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, age, roll_no, father_name, phone_no, face_embeddings, course_id, admin_id } = body;

  if (
    !name || !age || !roll_no || !father_name || !phone_no ||
    face_embeddings === undefined || course_id === undefined || admin_id === undefined
  ) {
    return new Response(JSON.stringify({ message: "Missing fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const add = await DB.execute(add_student_sql, [
      name,
      age,
      roll_no,
      father_name,
      phone_no,
      face_embeddings,
      course_id,
      admin_id,
    ]);

    return new Response(JSON.stringify({ message: "Student added successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error inserting student:", error);
    return new Response(JSON.stringify({ message: "Failed to add student" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
