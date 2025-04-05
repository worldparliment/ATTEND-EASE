import DB from "@/app/(db)/db";
import { match_password } from "@/app/(utility)/password";
import { admin_login_sql } from "@/app/(utility)/sql_queries";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"


export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const email = data.email;
        const password = data.password;



        console.log("Incoming Email:", email);
        console.log("Incoming Password:", password);

        // Fetch admin data from DB
        const [rows] = await DB.query(admin_login_sql(), [email]);

    

        const hashed_password = (rows as any[])[0].password;
        console.log("Hashed Password from DB:", hashed_password);

        // Compare passwords
        const match = await match_password(hashed_password, password);
        console.log("Password Match Result:", match);

        if (match) {
            const token = jwt.sign({ email }, process.env.SECRET_KEY!, { expiresIn: "1h" });
            const response = NextResponse.json({ message: "SUCCESSFUL" });
            response.cookies.set("token", token, { httpOnly: true, secure: true });
            return response;
        }
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        console.error("Login error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
