import DB from "@/app/(db)/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const details = await request.json();

    if (!details.roll_no) {
      return NextResponse.json({ error: "Missing roll_no" }, { status: 400 });
    }

    const fields: string[] = [];
    const values: any[] = [];

    if ("name" in details) {
      fields.push("name = ?");
      values.push(details.name ?? null);
    }
    if ("age" in details) {
      fields.push("age = ?");
      values.push(details.age ?? null);
    }
    if ("phone_no" in details) {
      fields.push("phone_no = ?");
      values.push(details.phone_no ?? null);
    }
    if ("father_name" in details) {
      fields.push("father_name = ?");
      values.push(details.father_name ?? null);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(details.roll_no);

    const sql = `UPDATE STUDENTS SET ${fields.join(", ")} WHERE roll_no = ?`;
    const [result]: any = await DB.execute(sql, values);

    return NextResponse.json({
      message: "Student updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
