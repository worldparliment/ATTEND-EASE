import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import DB from "@/app/(db)/db";
import { admin_login_sql } from "@/app/(utility)/sql_queries";

export async function GET() {
  try {
    let cook = await cookies();
    let sujal = cook.get("token");
    let real = sujal?.value as string;

    if (!real) {
      throw new Error("Token not found");
    }

    let s = (jwt.decode(real) as JwtPayload).email;

    if (!s) {
      throw new Error("Invalid token payload");
    }

    let [admin_data] = await DB.query(admin_login_sql(), [s]);

    if (!admin_data || (admin_data as any[]).length === 0) {
      throw new Error("Admin data not found");
    }

    let college_name = (admin_data as any[])[0].college_name;
    let super_admin_id = (admin_data as any[])[0].id;

    return Response.json({ college_name, super_admin_id });
  } catch (error) {
    console.error("Error in GET handler:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}