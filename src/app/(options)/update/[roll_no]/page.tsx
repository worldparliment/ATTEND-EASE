"use client";

import React, { useEffect, useState } from "react";
import { Student } from "@/app/(utility)/search_students";
import { search_student } from "@/app/(utility)/search_students_by_roll_no";
import { decode } from "@/app/(utility)/decode";
import { useRouter } from "next/navigation";
import "./update.css";

interface PageProps {
  params: Promise<{ roll_no: number }>;
}

type EditableStudentFields = Omit<Student, "face_embeddings">;

export default function Page(props: PageProps) {
  const [rollNo, setRollNo] = useState<number | null>(null);
  const [student, setStudent] = useState<EditableStudentFields | null>(null);
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Partial<EditableStudentFields>>({});
  const router = useRouter();

  // Resolve params
  useEffect(() => {
    props.params.then((resolved) => setRollNo(resolved.roll_no));
  }, [props.params]);

  // Fetch student info when rollNo is ready
  useEffect(() => {
    if (rollNo === null) return;

    const initialize = async () => {
      try {
        const token = localStorage.getItem("course_id");
        if (!token) {
          alert("please login into course first");
          router.push("/manage-students-login");
          return;
        }

        const token_verification = await decode(token);
        if (!token_verification) {
          alert("unauthorized");
          router.push("/manage-students-login");
          return;
        }

        const studentData = await search_student(rollNo);
        const data = studentData[0];
        const { face_embeddings, ...cleaned } = data;

        setStudent(cleaned);
        setFormData(cleaned);
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    initialize();
  }, [rollNo, router]);

  const handleDoubleClick = (key: keyof EditableStudentFields) => {
    setEditableFields((prev) => ({ ...prev, [key]: true }));
  };

  const handleChange = (key: keyof EditableStudentFields, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    if (!student) return;

    const updatedFields: Record<string, any> = {
      roll_no: student.roll_no, // include roll_no
    };

    for (const key in formData) {
      const k = key as keyof EditableStudentFields;
      if (formData[k] !== student[k]) {
        updatedFields[k] = formData[k];
      }
    }

    if (Object.keys(updatedFields).length <= 1) {
      alert("No changes to update.");
      return;
    }

    try {
      const response = await fetch("/update_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      const result = await response.json();
      console.log("Update response:", result);
      alert("Student updated successfully!");
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Error updating student");
    }
  };

  const safeValue = (val: any) => {
    if (typeof val === "string" || typeof val === "number") return val;
    if (val === null || val === undefined) return "";
    return String(val);
  };

  if (!student) return <div>Loading...</div>;

  const fields: (keyof EditableStudentFields)[] = ["name", "roll_no", "father_name", "age", "phone_no"];

  return (
    <div id="su">
      <h1>ACTIVE COURSE</h1>
      <h1>BCA-2025</h1>
      <div id="stylish-card">
        <h1>{student.name.toUpperCase()}</h1>
        <div id="card">
          <div id="labels-students">
            <h2>NAME</h2>
            <h2>ROLL NO</h2>
            <h2>FATHER NAME</h2>
            <h2>AGE</h2>
            <h2>PHONE</h2>
          </div>

          <div id="inputs-student">
            {fields.map((key) => (
              <input
                key={key}
                value={safeValue(formData[key])}
                onDoubleClick={() => key !== "roll_no" && handleDoubleClick(key)}
                onChange={(e) => handleChange(key, e.target.value)}
                readOnly={key === "roll_no" || !editableFields[key]}
              />
            ))}
          </div>
        </div>
        <button id="update" onClick={handleUpdate}>UPDATE</button>
      </div>
    </div>
  );
}
