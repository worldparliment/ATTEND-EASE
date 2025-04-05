export type SUPER_ADMIN = {
    name:string
    id:number;
    password: string;
    confirm_password: string;
    designation: string;
    email: string;
    college_name: string;
    address: string;
}


export type COURSE_DETAILS = {
    course_id:number
    course_name:string;
    course_year:number;
    password:string;
    admin_id:number
}


export type ADD_STUDENTS = {
    name:string;
    age:number;
    roll_no:string;
    father_name:string;
    phone_no:string;
    face_embeddings:string[];
    course_id:number
    admin_id:number
}