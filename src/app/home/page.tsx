import React from 'react';
import './home.css'; // Import the CSS file
import Link from 'next/link';

function AttendEaseLanding() {
 
  return (
      
    <div className="container">

    <img src='./attendease.svg'/>

    <div className="button-frame">
    <div className="corner"></div>
    <Link href={"/registration"}> <button  className="try-now-button">TRY NOW</button></Link> 
  </div>


    </div>
  );
}

export default AttendEaseLanding;