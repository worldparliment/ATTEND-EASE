import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"

export async function POST (request:NextRequest) {
    let data = await request.json();
    let course_id = data.course_id;
    const secret_key = "sujalisbestintheworld"
    let token = jwt.sign({ course_id }, secret_key, { expiresIn: '1h' });

    return new Response(JSON.stringify({ token }), {
        headers: { 'Content-Type': 'application/json' }
    });
}