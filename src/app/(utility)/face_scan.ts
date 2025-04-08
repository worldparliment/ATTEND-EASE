
import * as faceapi from 'face-api.js';


export async function generate_image_embdeddings(canvas: HTMLCanvasElement) {
  
    const detection = await faceapi.detectSingleFace(canvas)
        .withFaceLandmarks()
        .withFaceDescriptor();
     
        return detection;
}