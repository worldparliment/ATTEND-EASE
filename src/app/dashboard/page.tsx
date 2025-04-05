"use client";

import "./dashboard.css"

import React, { useEffect, useState } from "react";

export default function Page() {
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/admin_data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setEmail(data.college_name); // Store email in state
      } catch (err) {
        setError("Error loading dashboard");
        console.error("Error:", err);
      }
    }

    fetchData();
  }, []); // Runs once when component mounts

  return (
    <div >
      



      <div className="dashboard-title">
      <h1>WELCOME TO <span className="highlight">{email?.toUpperCase()}</span>
      <br />
      <span className="highlight">COLLEGE</span> ATTENDANCE
      <br />
      DASHBOARD</h1>
    </div> 
    
     
     <div id="analytics-box">
      
      <div id="four-boxes">
        

        <div id="pairs">
        <div className="data-boxes">
           <h3>TOTAL STUDENTS</h3>
           <div className="data">
                 <h1>400</h1>
           </div>
        </div>

        <div className="data-boxes">
        <h3>TOTAL PRESENT</h3>
        <div className="data">
            <h1>240</h1>
            </div>
        </div>

        </div>
       

       <div id="pairs">
        <div className="data-boxes">
        <h3>TOTAL ABSENT</h3>
        <div className="data">
        <h1>160</h1>
            </div>
        </div>

        <div className="data-boxes">
        <h3>ATTENDANCE RATE</h3>
        <div className="data">
        <h1>80%</h1>
            </div>
        </div>
        </div>



      </div>


      <div id="top-attendance">
          <h2>OVERVIEW</h2>
          <div id="data-overview"></div>
          <h4>TOP 5 HIGHEST ATTENDANCE</h4>
          <div id="students-attendance">SUJAL (BCA2) - 56%</div>
          <div id="students-attendance">AKASH (BCA1) - 56%</div>
          <div id="students-attendance">SUJAL (BCA1) - 56%</div>
          <div id="students-attendance">RIYA (BCA2) - 56%</div>
          <div id="students-attendance">SUJAL (BCA2)- 56%</div>
      </div>


     </div>








    </div>
  );
}
