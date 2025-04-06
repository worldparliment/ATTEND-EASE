import DB from "@/app/(db)/db";
import { NextRequest } from "next/server";
type FaceEmbedding = {
    face_embeddings: number[];
    name: string;
    course_id: number;
};

export async function POST(request: NextRequest) {
    const { course_id } = await request.json();

    try {
        const [rows] = await DB.query(
            "SELECT face_embeddings, name, course_id , roll_no FROM STUDENTS WHERE course_id = ?",
            [course_id]
        );

        const embeddings = (rows as any[]).map(row => {
            const blobData = row.face_embeddings;
            
            return {
                face_embeddings: JSON.parse(Buffer.from(blobData).toString()),
                name: row.name,
                course_id: row.course_id,
                roll_no:row.roll_no

            } as FaceEmbedding;
        });

        return new Response(JSON.stringify(embeddings), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Error fetching face embeddings:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch embeddings" }), {
            status: 500,
        });
    }
}
