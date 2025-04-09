import React from 'react';
import './home.css'; // Import the CSS file
import Link from 'next/link';

function AttendEaseLanding() {
 
  return (
    <div className="container">
      <div className="attend-ease-card">
        <div className="logo-container">
          <img 
            src="https://cdn-icons-png.flaticon.com/128/7124/7124494.png" 
            alt="Face Recognition Icon" 
            className="icon-image"
          />
        </div>
        
        <div className="brand-name">
          <div className="brand-text">
            <span className="attend">ATTEND-</span>
            <span className="ease">EASE</span>
          </div>
        </div>
        
        <div className="tagline">
          THE SMARTER WAY TO TRACK ATTENDANCE
          <span className="tagline-dot">.</span>
        </div>
        
       <Link href={"/registration"}> <button  className="cta-button">
          TRY NOW
        </button></Link>
      </div>
    </div>
  );
}

export default AttendEaseLanding;