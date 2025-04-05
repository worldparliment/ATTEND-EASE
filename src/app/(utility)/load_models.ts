export const loadModels = async () => {
  // @ts-ignore: faceapi is from CDN
  const faceapi = window.faceapi;


    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
    } catch (error) {
      console.error(error);
    }
  

  console.log("✅ FaceAPI models loaded");
};
