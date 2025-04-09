import { decode } from "./decode"



export async function DELETE(roll_no: string) {
    const course_ids = localStorage.getItem("course_id");
    if (!course_ids) {
        return new Response(JSON.stringify({ error: 'course_id not found in localStorage' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const course_idss = await decode(course_ids as string);
    const course_id = course_idss.course_id.toString();
  


    try {
        const response = await fetch("/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roll_no, course_id }),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete: ${response.statusText}`);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error}), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}