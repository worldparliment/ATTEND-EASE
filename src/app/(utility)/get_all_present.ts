import { attendance } from "./get_attendance";
import { get_courses } from "./get_courses";
import { get_super_admin_id } from "./get_super_admin_id";



export async function get_all_presents () {
   

    let super_admin_id =  await get_super_admin_id();

    let courses: { course_id: number }[] = await get_courses(super_admin_id as number);

    let all: number = 0;

    for (const course of courses) {
        const present_course = await attendance(course.course_id);
        all += present_course.length;
    }

  return all


}