import { get_courses } from "./get_courses";
import { get_super_admin_id } from "./get_super_admin_id";


interface Course {
    course_id: number;
    course_name: string;
}

export async function get_course_name(course_id: number): Promise<string | undefined> {
    const start: Course[] = await get_courses(await get_super_admin_id() as number);

    for (const co of start) {
        if (co.course_id === course_id) {
            return co.course_name;
        }
    }

    return undefined;
}