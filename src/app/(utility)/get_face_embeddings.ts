export type FaceEmbedding = {
    face_embeddings: number[];
    name: string;
    course_id: number;
    roll_no:number;
  };
  
  export const get_all_face_embeddings = async (
    course_id: number
  ): Promise<FaceEmbedding[]> => {
    const response = await fetch("http://localhost:3000/get_embeddings", {
      method: "POST",
      body: JSON.stringify({ course_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    console.log("DB returned rows:", response);
    const data = await response.json();
    return data ;
  };
  