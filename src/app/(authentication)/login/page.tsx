"use client";

import { useState } from "react";
import "./login.css";
import React from "react";
import "../../../../node_modules/augmented-ui/augmented-ui.min.css";
import { login_route, register_route } from "@/app/_Routesurl/urls";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Page() {
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });
  const router = useRouter();

  function redirect_to_dashboard(){
     router.push("/dashboard")
  }

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function registerUser(formdata: { email: string; password: string }) {
    try {
      const response = await fetch(login_route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formdata }),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        setPopupMessage("Login Successful! 🎉");
        setPopupOpen(true);
        setTimeout(() => {
            redirect_to_dashboard();
        }, 1000);
      } else {
        setPopupMessage(result.message || "Failed to login.");
        setPopupOpen(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setPopupMessage("Failed to login.");
      setPopupOpen(true);
    }
  }

  return (
    <div id="login-container">
      <h1>LOGIN</h1>

      <div id="login-box-wrapper" data-augmented-ui="border tl-clip">
        <div id="login-box" data-augmented-ui="border tl-clip">
          <div id="form-labels">
            <label htmlFor="email">EMAIL</label>
            <label htmlFor="password">PASSWORD</label>
          </div>

          <div id="form-inputs">
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
          </div>
        </div>
      </div>

      <button id="login-button" onClick={() => registerUser(formData)}>
        LOGIN
      </button>

      <h4>
        Don't have an account?{" "}
        <Link href={"/registration"}>
          <button id="register-button">REGISTER</button>
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
          border: 2px solid #ce4c64;
        }
        .close-btn {
          background: #ce4c64;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          margin-top: 10px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}
