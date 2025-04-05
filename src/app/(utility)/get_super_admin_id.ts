import { admin_data } from "../_Routesurl/urls";

export async function get_super_admin_id():Promise<number | undefined>{
    try {
        const response = await fetch(admin_data, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data.super_admin_id ;
    } catch (error) {
        console.error("Error fetching super admin ID:", error);
        return undefined;
    }
}