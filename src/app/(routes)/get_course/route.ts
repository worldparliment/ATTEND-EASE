import DB from "@/app/(db)/db";
import { get_all_courses_sql } from "@/app/(utility)/sql_queries";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    try {
        let data = await request.json();
        let super_admin_id = data.super_admin_id;

        if (!super_admin_id) {
            return new Response("Missing super_admin_id", { status: 400 });
        }

        const [courses] = await DB.query(get_all_courses_sql, [super_admin_id]);

        return Response.json({ courses });
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
