"use client"
import"./add.css"
import React, { useEffect, useState } from 'react'
import { decode } from '../(utility)/decode'
import { get_course_name } from '../(utility)/get_course_name';

export default function Course_Name() {
    const [courseName, setCourseName] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCourseName = async () => {
            try {
                const token = localStorage.getItem("course_id");
                console.log("course_id from localStorage:", token);
                if (token) {
                    const decoded = await decode(token);
                    console.log("Decoded course_id:", decoded);

                    if (decoded?.course_id) {
                        const name = await get_course_name(decoded.course_id);
                        setCourseName(name as string)
                    } else {
                        setError("Invalid course ID in token");
                    }
                } else {
                    setError("No course ID found in localStorage.");
                }
            } catch (err) {

                setError("LOGIN PLEASE INTO COURSE");
            }
        };
        fetchCourseName();
    }, []);

    return (
        <div>
            {error ? <p style={{ color: "red" }}>{error}</p> : <p id='di'>{courseName}</p>}
        </div>
    )
}
