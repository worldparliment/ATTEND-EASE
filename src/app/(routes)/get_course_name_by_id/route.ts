import DB from "@/app/(db)/db";

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const course_id = body.course_id;

    if (!course_id) {
      return new Response("Missing course_id", { status: 400 });
    }

    const [course_data] = await DB.query("SELECT course_name FROM courses WHERE course_id = ? ", [course_id]);

    if (!course_data || (course_data as any[]).length === 0) {
      return new Response("Course not found", { status: 404 });
    }

    const course_name = (course_data as any[])[0].course_name;
    return Response.json({ course_name });
  } catch (err) {
    console.error("Error in get_course_name_by_id:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
