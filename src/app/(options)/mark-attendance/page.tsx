"use client"

import "./mark-attendance.css"
import { get_all_face_embeddings } from '@/app/(utility)/get_face_embeddings'
import React, { useEffect, useRef } from 'react'
import match_face from '@/app/(utility)/match_face';
import { loadModels } from '@/app/(utility)/load_models';
import { generate_image_embdeddings } from "@/app/(utility)/face_scan";
import Popup from "@/app/Component/pop-up";
import { get_all_attendance } from "@/app/(utility)/get_all_students";
import { MARK_ATTENDANCE } from "@/app/(utility)/mark_attendances";
import { Mark_attendance , STATUS } from "@/app/(utility)/mark_attendances";
import faceapi from "face-api.js"
import { normalizeVector } from "@/app/(utility)/normalize";



export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [students, setStudents] = React.useState<Array<{course_id: number, embedding: any[], name: string , roll_number:string}>>([]);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [isPopupOpenFailed, setIsPopupOpenFailed] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [face_name, setFaceName] = React.useState("");
  const [roll_no , setRollno] = React.useState('');



 
  

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initialize = async () => {
      await loadModels();

      let student = await get_all_face_embeddings(202489 as number);
      student.forEach((student) => {
        students.push({course_id: student.course_id, embedding: student.face_embeddings, name: student.name , roll_number:student.roll_no.toString()} );
      });

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    initialize();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  async function handleCapture() {
    console.log('Capture button clicked');
    
    // Show searching popup
    setIsSearching(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setIsSearching(false);
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      setIsSearching(false);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const embeddings = await generate_image_embdeddings(canvas);
      if (!embeddings?.descriptor) {
        console.error('No face detected or no descriptor found');
        setIsSearching(false);
        setIsPopupOpenFailed(true);
        return;
      }

      const plainArray = Array.from(embeddings.descriptor);
      const face_array_to_match_with = normalizeVector(plainArray)
      console.log('Face embedding:', plainArray);

      let matchFound = false;
      for (const student of students) {
        const match = match_face(student.embedding, face_array_to_match_with);
        if (match && match > 0.9) {
          setRollno(student.roll_number.toString())
          setFaceName(student.name);
          setIsPopupOpen(true);
          let data:Mark_attendance = {roll_number:student.roll_number , status:STATUS.PRESENT , course_id:student.course_id , name:student.name};
          console.log(data);
          console.log(`Match found with score: ${match}`);
          matchFound = true;
          MARK_ATTENDANCE(data)
          break;
        }
      }
      
      if (!matchFound) {
        setIsPopupOpenFailed(true);
        console.log('No match found above threshold 0.9');
      }
    } catch (err) {
      console.error('Error generating embeddings:', err);
      setIsPopupOpenFailed(true);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div id='mark-attendance-page'>
      <div id='mark-attendance-header'>
        <h2>ACTIVE COURSE - BCA2025</h2>
      </div>

      <div id="video-container-mark-attendance">
        <video
          id="face-scan-video"
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', maxWidth: '500px' }}
        />
      </div>

      <button id="capture-button" onClick={handleCapture}>MARK</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <div>FACE MATCHED WITH {face_name.toUpperCase()}{roll_no}</div>
      </Popup>
      
      <Popup isOpen={isPopupOpenFailed} onClose={() => setIsPopupOpenFailed(false)}>
        <div>NOT REGISTERED YET</div>
      </Popup>
      
      <Popup isOpen={isSearching} onClose={() => setIsSearching(false)}>
        <div>SEARCHING FOR MATCH...</div>
      </Popup>
    </div>
  )
}