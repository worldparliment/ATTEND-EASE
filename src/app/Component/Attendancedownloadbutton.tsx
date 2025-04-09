'use client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';


export interface AttendanceData {
  date: string;
  status: string; // "Present" or "Absent"
}

export default function AttendancePDFButton() {
  const [loading, setLoading] = useState(false);
  const  [data, setData] = useState([]);

  const generateAttendancePDF = () => {
    setLoading(true);

    const doc = new jsPDF();
    const studentId = "TEMP123";

     async function get(){
        const res = await fetchAttendancebyrollno(22007);
        setData(res)
     }



    doc.setFontSize(18);
    doc.text("🎓 Student Attendance Report", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Student ID: ${studentId}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36);

    const tableData = data.map((entry:AttendanceData, i) => [i + 1, entry.date, entry.status]);

    const presentCount = data.filter((d:AttendanceData) => d.status === "Present").length;
    const total = data.length;
    const attendancePercent = ((presentCount / total) * 100).toFixed(2);

    autoTable(doc, {
      head: [["#", "Date", "Status"]],
      body: tableData,
      startY: 45,
      styles: {
        fontSize: 11,
        cellPadding: 4,
        halign: "center",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 45;
    doc.setFontSize(13);
    doc.setTextColor(0, 102, 0);
    doc.text(`✅ Attendance: ${presentCount}/${total} (${attendancePercent}%)`, 14, finalY + 10);

    doc.save(`attendance-${studentId}.pdf`);
    setLoading(false);
  };

  return (
    
      <button
        onClick={generateAttendancePDF}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#2980b9',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Generating PDF...' : 'Download Attendance PDF'}
      </button>
    );
 
}
