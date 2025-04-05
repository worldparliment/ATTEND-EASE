import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken"
import DB from "@/app/(db)/db";
import { admin_login_sql } from "@/app/(utility)/sql_queries";

export async function GET(){
   let cook =  await cookies()
 
 let sujal = cook.get("token")
 let real = sujal?.value as string

 
  
let s = (jwt.decode(real) as JwtPayload).email;
  
 let [admin_data] =  await DB.query(admin_login_sql() , [s])

 let college_name =  (admin_data as any[])[0].college_name;
 let super_admin_id = (admin_data as any[])[0].id;

 return Response.json({college_name , super_admin_id});

}