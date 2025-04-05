import { encrypt_password } from "@/app/(utility)/password";
import DB from "@/app/(db)/db";
import type { NextRequest } from "next/server";
import { admin_registration_sql } from "@/app/(utility)/sql_queries";


export async function POST(request: NextRequest) {
  try {
    const details = await request.json();
  

    const values = [
      details.name,
      details.email,
      details.password,
      details.college_name,
      details.designation,
      details.address,
    ];

    await DB.execute(admin_registration_sql, values);

    return Response.json("Added new admin successfully");
  } catch (error) {
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
