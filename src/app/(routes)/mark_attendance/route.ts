import DB from "@/app/(db)/db";
import { NextRequest, NextResponse } from "next/server";

export enum STATUS {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export type Mark_attendance = {
  roll_number: string;
  status: STATUS;
  course_id: number;
  name: string;
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // ✅ Validation
    if (
      !data.roll_number ||
      !data.status ||
      typeof data.course_id !== "number" ||
      !data.name
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const clean: Mark_attendance = {
      roll_number: String(data.roll_number),
      status: data.status as STATUS,
      course_id: Number(data.course_id),
      name: String(data.name),
    };

    const [result] = await DB.execute(
      `INSERT INTO ATTENDANCE (roll_number, status, course_id, name)
       VALUES (?, ?, ?, ?)`,
      [clean.roll_number, clean.status, clean.course_id, clean.name]
    );

    return NextResponse.json({ success: true, result }, { status: 200 });

  } catch (error: any) {
    console.log("Error in mark_attendance route:", error);

    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
