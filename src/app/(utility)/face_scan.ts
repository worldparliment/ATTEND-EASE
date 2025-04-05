import Popup from "../Component/pop-up";

declare global {
    interface Window {
        faceapi: any;
    }
}

export async function generate_image_embdeddings(canvas: HTMLCanvasElement) {
    const faceapi = window.faceapi;
    const detection = await faceapi.detectSingleFace(canvas)
        .withFaceLandmarks()
        .withFaceDescriptor();
     
        return detection;
}