'use client';

import { generate_image_embdeddings } from '@/app/(utility)/face_scan';
import './face-scan.css';
import { loadModels } from '@/app/(utility)/load_models';
import React, { useEffect, useRef, useState } from 'react';
import Popup from '@/app/Component/pop-up';
import { useRouter } from 'next/navigation';
import * as faceapi from 'face-api.js';
import { normalizeVector } from '@/app/(utility)/normalize';
import { get_super_admin_id } from '@/app/(utility)/get_super_admin_id';
import { decode } from '@/app/(utility)/decode';

export default function FaceScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenface, setIsPopupOpenface] = useState(false);
  const [isPopupOpenprocessing, setIsPopupOpenprocessing] = useState(false);
  const router = useRouter();

  const [super_admin_id, setSuperAdminId] = useState<number | null>(null);
  const [course_id, setCourseId] = useState<number | null>(null);

  // ⛔ Redirect if not super_admin or invalid course token
  useEffect(() => {
    async function verifyAccess() {
      try {
        const adminId = await get_super_admin_id();
        if (!adminId) throw new Error("No super admin ID");
        setSuperAdminId(adminId);

        const token = localStorage.getItem("course_id");
        if (!token) throw new Error("Missing course token");

        const decoded = await decode(token);
        if (!decoded?.course_id) throw new Error("Invalid course token");
        setCourseId(decoded.course_id);
      } catch (error: any) {
        console.error("Access error:", error.message);

        if (error.message.includes("super admin")) {
          alert("Access denied. Redirecting to login.");
          router.push("/login");
        } else {
          alert("You are not authorized to scan faces for this course.");
          router.push("/manage-student-login");
        }
      }
    }

    verifyAccess();
  }, []);

  // 👁️ Load face models + camera
  useEffect(() => {
    const init = async () => {
      await loadModels();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    init();
  }, []);

  async function handleCapture() {
    setIsPopupOpenprocessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const embeddings = await generate_image_embdeddings(canvas);

        if (!embeddings?.descriptor) {
          setIsPopupOpenprocessing(false);
          setIsPopupOpen(true);
          return;
        }

        const plainArray = Array.from(embeddings.descriptor);
        const normalized = normalizeVector(plainArray);
        localStorage.setItem('face_embedding', JSON.stringify(normalized));

        setIsPopupOpenprocessing(false);
        setIsPopupOpenface(true);

        setTimeout(() => {
          router.push('/add-student');
        }, 2000);
      }
    }
  }

  return (
    <div>
      <div id="face-scan-header-text">
        <h1>
          <span id="kh">ATTEND-EASE </span>FACE SCAN
        </h1>
      </div>

      <div id="video-container">
        <video
          id="face-scan-video"
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', maxWidth: '500px' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }} id='face-scan-btn'>
        <button onClick={handleCapture} className="capture-btn">SCAN</button>
      </div>

      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="ERROR">
        <h3>NO FACE DETECTED. PLEASE TRY AGAIN.</h3>
      </Popup>

      <Popup isOpen={isPopupOpenface} onClose={() => setIsPopupOpenface(false)} title="SUCCESS">
        <h3>FACE DETECTED!</h3>
      </Popup>

      <Popup isOpen={isPopupOpenprocessing} onClose={() => setIsPopupOpenprocessing(false)} title="PROCESSING">
        <h3>PROCESSING FACE... PLEASE WAIT :)</h3>
      </Popup>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
