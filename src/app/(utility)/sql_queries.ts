export function admin_login_sql(): string {
    return `SELECT * FROM SUPER_ADMINS WHERE email = ?`;
}

export const admin_registration_sql = `
    INSERT INTO SUPER_ADMINS (name, email, password, college_name, designation, address) 
    VALUES (?, ?, ?, ?, ?, ?)
`;



export const add_course_sql = ` INSERT INTO courses (course_id, course_name, course_year, course_password, super_admin_id)
VALUES (?,?,?,?,?)`;



export const get_all_courses_sql = `SELECT course_name , course_id FROM courses WHERE super_admin_id = ?`;


export const add_student_sql = `
    INSERT INTO STUDENTS ( name,
    age,
    roll_no,
    father_name,
    phone_no,
    face_embeddings,
    course_id,
    admin_id)
    VALUES (?, ?, ?, ?, ?, ?, ? , ?)
`;