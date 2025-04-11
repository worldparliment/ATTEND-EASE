'use client';

import './mark-attendance.css';
import { get_all_face_embeddings } from '@/app/(utility)/get_face_embeddings';
import React, { useEffect, useRef, useState } from 'react';
import match_face from '@/app/(utility)/match_face';
import { loadModels } from '@/app/(utility)/load_models';
import { generate_image_embdeddings } from '@/app/(utility)/face_scan';
import Popup from '@/app/Component/pop-up';
import { MARK_ATTENDANCE, Mark_attendance, STATUS } from '@/app/(utility)/mark_attendances';
import { normalizeVector } from '@/app/(utility)/normalize';
import { decode } from '@/app/(utility)/decode';
import { get_student_count } from '@/app/(utility)/get_student_count';
import { attendance } from '@/app/(utility)/get_attendance';
import { get_course_name } from '@/app/(utility)/get_course_name';
import { useRouter } from 'next/navigation';
import Course_Name from '@/app/Component/add';

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [students, setStudents] = useState<Array<{ course_id: number; embedding: any[]; name: string; roll_number: string }>>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenFailed, setIsPopupOpenFailed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [faceName, setFaceName] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [marked, setMarked] = useState(0);
  const [login, setLogin] = useState(false);
  const [alreadymarked, setAlreadyMarked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initialize = async () => {
      try {
        // 1) Load face-api models
        await loadModels();

        // 2) Verify course token & fetch data
        const token = localStorage.getItem('course_id');
        if (!token) {
          setLogin(true);
          setTimeout(() => router.push('/manage-students-login'), 2000);
          return;
        }
        const decoded = await decode(token);
        const course_id = decoded.course_id;

        const [course_name, allStudentsRaw, markedStudents, faceEmbeddings] = await Promise.all([
          get_course_name(course_id),
          get_student_count('FOR', course_id, undefined),
          attendance(course_id),
          get_all_face_embeddings(course_id),
        ]);

        setRemaining((allStudentsRaw as any[]).length);
        setMarked(markedStudents.length);

        const formatted = (faceEmbeddings as any[]).map((s) => ({
          course_id: s.course_id,
          embedding: s.face_embeddings,
          name: s.name,
          roll_number: s.roll_no.toString(),
        }));
        setStudents(formatted);

        // 3) Start camera & force play
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Explicitly play so preview shows immediately
          // (works around some autoplay policies)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await videoRef.current!.play();
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setLogin(true);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [router]);

  async function handleCapture() {
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 0));

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      setIsSearching(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsSearching(false);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const avg = Math.min(255, Math.max(0, ((d[i] + d[i+1] + d[i+2]) / 3 - 128) * 1.5 + 128));
      d[i] = d[i+1] = d[i+2] = avg;
    }
    ctx.putImageData(imgData, 0, 0);

    try {
      const emb = await generate_image_embdeddings(canvas);
      if (!emb?.descriptor) {
        setIsSearching(false);
        setIsPopupOpenFailed(true);
        return;
      }

      const probe = normalizeVector(Array.from(emb.descriptor));
      let best: any = null;
      let topScore = 0;

      for (const s of students) {
        const score = match_face(probe, normalizeVector(s.embedding));
        if (score > topScore) {
          topScore = score;
          best = s;
        }
      }

      if (best && topScore > 0.95) {
        setFaceName(best.name);
        const payload: Mark_attendance = {
          roll_number: best.roll_number,
          status: STATUS.PRESENT,
          course_id: best.course_id,
          name: best.name,
        };
        const res = await MARK_ATTENDANCE(payload);
        if (!res.success) {
          setAlreadyMarked(true);
        } else {
          setIsPopupOpen(true);
          setMarked((m) => m + 1);
        }
      } else {
        setIsPopupOpenFailed(true);
      }
    } catch (err) {
      console.error('Capture error:', err);
      setIsPopupOpenFailed(true);
    } finally {
      setIsSearching(false);
    }
  }

  if (isLoading) {
    return <div className="loading-screen">Loading attendance system...</div>;
  }

  return (
    <div id="mark-attendance-page">
      <div id="mark-attendance-header">
        <h2>ACTIVE COURSE – <Course_Name /></h2>
      </div>

      <div id="data-attend">
        <h2>REMAINING: <span>{remaining - marked}</span></h2>
        <h2>MARKED: <span>{marked}</span></h2>
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

      <button id="capture-button" onClick={handleCapture}>
        MARK
      </button>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <Popup isOpen={isSearching} onClose={() => setIsSearching(false)}>
        <div>SEARCHING FOR MATCH...</div>
      </Popup>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <div>ATTENDANCE MARKED {faceName.toUpperCase()}</div>
      </Popup>
      <Popup isOpen={isPopupOpenFailed} onClose={() => setIsPopupOpenFailed(false)}>
        <div>NOT REGISTERED YET</div>
      </Popup>
      <Popup isOpen={login} onClose={() => setLogin(false)}>
        <div>PLEASE LOGIN FIRST INTO COURSE</div>
      </Popup>
      <Popup isOpen={alreadymarked} onClose={() => setAlreadyMarked(false)}>
        <div>ALREADY MARKED FOR {faceName.toUpperCase()}</div>
      </Popup>
    </div>
  );
}
