

export async function get_courses(super_admin_id: number): Promise< [] | []> {
    try {
        const response = await fetch("/get_course", {
            method: "POST",
            body: JSON.stringify({ super_admin_id }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data.courses || [];  // Return empty array if courses is undefined
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];  // Return empty array instead of null
    }
}