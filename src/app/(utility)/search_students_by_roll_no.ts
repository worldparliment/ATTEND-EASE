

export interface Student{
    name: string;
    roll_no: string;
    age: number;
    phone_no: string;
    father_name: string;
    face_embeddings: Buffer;
}




export async function search_student(roll_no: number): Promise<Student[]> {
    try {
        const response = await fetch("http://localhost:3000/search_student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ roll_no })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const studentArray: Student[] = await response.json();
        return studentArray;
    } catch (error) {
        console.error('Error searching for student:', error);
        return [];
    }
}