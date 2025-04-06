import DB from "@/app/(db)/db";
import { NextRequest, NextResponse } from "next/server";

export enum STATUS {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export type Mark_attendance = {
  roll_number: string; // ✅ now a string
  status: STATUS;
  course_id: number;
  name: string;
};

export async function POST(request: NextRequest) {
  const data = await request.json();

  // ✅ Defensive checks
  if (
    !data.roll_number ||
    !data.status ||
    data.course_id === undefined ||
    !data.name
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const clean: Mark_attendance = {
    roll_number: String(data.roll_number),
    status: data.status as STATUS,
    course_id: Number(data.course_id),
    name: String(data.name),
  };

  try {
    const [result] = await DB.execute(
      `INSERT INTO ATTENDANCE (roll_number, status, course_id, name)
       VALUES (?, ?, ?, ?)`,
      [clean.roll_number, clean.status, clean.course_id, clean.name]
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("DB Insert Error:", error);
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  }
}
