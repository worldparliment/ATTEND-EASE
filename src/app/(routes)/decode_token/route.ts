import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = "sujalisbestintheworld";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { course_id: number };

    return NextResponse.json({ course_id: decoded.course_id });

  } catch (error) {
    console.error("JWT Decode error:", error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
