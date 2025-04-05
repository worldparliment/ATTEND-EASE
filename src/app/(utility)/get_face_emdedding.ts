import jwt from "jwt-simple";


export default function getFaceEmbedding(){
   const face = localStorage.getItem('face_embedding')
   console.log("face", face)
   return face
}
