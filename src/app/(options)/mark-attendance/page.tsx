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
  const [courseName, setCourseName] = useState('');
  const [login, setLogin] = useState(false);
  const [alreadymarked, setAlreadyMarked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initialize = async () => {
      try {
        await loadModels();

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
          get_all_face_embeddings(course_id)
        ]);

        setCourseName(course_name as string);
        setRemaining((allStudentsRaw as any[]).length);
        setMarked(markedStudents.length);

        const formattedStudents = faceEmbeddings.map((student: any) => ({
          course_id: student.course_id,
          embedding: student.face_embeddings,
          name: student.name,
          roll_number: student.roll_no.toString()
        }));
        setStudents(formattedStudents);

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.log('Error initializing attendance system:', error);
        setLogin(true);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function handleCapture() {
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

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      let avg = (r + g + b) / 3;
      avg = Math.min(255, Math.max(0, (avg - 128) * 1.5 + 128));
      data[i] = data[i + 1] = data[i + 2] = avg;
    }

    context.putImageData(imageData, 0, 0);

    try {
      const embeddings = await generate_image_embdeddings(canvas);
      if (!embeddings?.descriptor) {
        setIsPopupOpenFailed(true);
        return;
      }

      const faceToMatch = normalizeVector(Array.from(embeddings.descriptor));

      let bestMatchStudent = null;
      let bestMatchScore = 0;

      for (const student of students) {
        const storedEmbedding = normalizeVector(student.embedding);
        const score = match_face(faceToMatch, storedEmbedding);
        console.log(`Match score with ${student.name}: ${score}`);

        if (score > bestMatchScore) {
          bestMatchScore = score;
          bestMatchStudent = student;
        }
      }

      if (bestMatchStudent && bestMatchScore > 0.95) {
        setFaceName(bestMatchStudent.name);
        const data: Mark_attendance = {
          roll_number: bestMatchStudent.roll_number,
          status: STATUS.PRESENT,
          course_id: bestMatchStudent.course_id,
          name: bestMatchStudent.name
        };

        const response = await MARK_ATTENDANCE(data);

        if (response.success === false) {
          setAlreadyMarked(true);
          return;
        }

        setIsPopupOpen(true);
        setMarked((prev) => prev + 1);
      } else {
        setIsPopupOpenFailed(true);
      }
    } catch (err) {
      console.log('Error generating embeddings:', err);
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
        <h2>ACTIVE COURSE - <Course_Name/></h2>
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

      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <div>ATTENDANCE MARKED {faceName.toUpperCase()}</div>
      </Popup>

      <Popup isOpen={isPopupOpenFailed} onClose={() => setIsPopupOpenFailed(false)}>
        <div>NOT REGISTERED YET</div>
      </Popup>

      <Popup isOpen={isSearching} onClose={() => setIsSearching(false)}>
        <div>SEARCHING FOR MATCH...</div>
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
