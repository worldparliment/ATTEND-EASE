import DB from "@/app/(db)/db";
import { add_course_sql } from "@/app/(utility)/sql_queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const data = await request.json();

        // Ensure required fields are provided
        if (!data.course_id || !data.course_name || !data.course_year || !data.password || !data.admin_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Prepare SQL values
        const details = [data.course_id, data.course_name, data.course_year, data.password, data.admin_id];

        // Execute query
        const [add_course] = await DB.execute(add_course_sql, details);

        return NextResponse.json({ message: "Course added successfully", add_course }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to add course" }, { status: 500 });
    }
}
