


interface Course {
    course_id: number;
    course_name: string;
}

export async function get_course_name(course_id: number): Promise<string | null> {
    try {
      const res = await fetch("/get_course_name_by_id", {
        method: "POST",
        body: JSON.stringify({ course_id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        const text = await res.text();
        console.error("get_course_name error response:", text);
        return null;
      }
  
      const data = await res.json();
      return data.course_name;
    } catch (err) {
      console.error("get_course_name error:", err);
      return null;
    }
  }
  