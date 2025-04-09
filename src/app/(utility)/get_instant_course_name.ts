import { decode } from "./decode";
import { get_course_name } from "./get_course_name";


export async function get_instant_course_name(): Promise<string | undefined> {
    let token = localStorage.getItem("course_id") as string;
    let decoded = await decode(token);
    let course_id = decoded.course_id as number;
     const course_name = await get_course_name(course_id);
    return course_name;
}