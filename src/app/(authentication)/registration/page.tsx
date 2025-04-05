"use client";

import { useState } from "react";
import "./registration.css";
import React from "react";
import "../../../../node_modules/augmented-ui/augmented-ui.min.css";
import { SUPER_ADMIN } from "@/app/(types)/types";
import { register_route } from "@/app/_Routesurl/urls";
import { encrypt_password } from "@/app/(utility)/password";
import Link from "next/link";


export default function Page() {
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
    designation: "",
    email: "",
    college_name: "",
    address: "",
    id: 233343,
    name: "sujal",
  });

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function registerUser(formdata: SUPER_ADMIN) {
    try {
      if (formdata.password !== formdata.confirm_password) {
        alert("Passwords do not match!");
        return;
      }

      const encryptedPassword = await encrypt_password(formdata.password);

      const response = await fetch(register_route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formdata,
          password: encryptedPassword,
        }),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        setPopupMessage("Registration Successful! 🎉");
        setPopupOpen(true);
      } else {
        setPopupMessage(result.message || "Failed to register.");
        setPopupOpen(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setPopupMessage("Failed to register.");
      setPopupOpen(true);
    }
  }

  return (
    <div id="register-form-container">
      <h1>REGISTER</h1>

      <div id="register-form-big" data-augmented-ui="border tl-clip">
        <div id="register-form" data-augmented-ui="border tl-clip">
          <div id="labels">
            <label htmlFor="college_name">COLLEGE NAME</label>
            <label htmlFor="email">EMAIL</label>
            <label htmlFor="password">PASSWORD</label>
            <label htmlFor="confirm_password">CONFIRM PASSWORD</label>
            <label htmlFor="designation">DESIGNATION</label>
            <label htmlFor="address">ADDRESS</label>
          </div>

          <div id="inputs">
            <input
              type="text"
              id="college_name"
              name="college_name"
              value={formData.college_name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <button id="REGISTER" onClick={() => registerUser(formData)}>
        REGISTER
      </button>

      <h4>
        ALREADY REGISTERED COLLEGE{" "}
        <Link href={"/login"}>
          <button id="login">LOGIN</button>
        </Link>
      </h4>

      {/* Popup */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{popupMessage}</h3>
            <button className="close-btn" onClick={() => setPopupOpen(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
          min-width: 300px;
          text-align: center;
          border:2px solid  #CE4C64;
        }
        .close-btn {
          background: #CE4C64;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          margin-top: 10px;
          border-radius:5px
        }
      `}</style>
    </div>
  );
}
