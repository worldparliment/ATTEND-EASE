'use client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';
import { fetchAttendancebyrollno } from '../(utility)/get_attend_roll';
import { admin_data } from '../_Routesurl/urls';


export interface AttendanceData {
  formatted_date: string;
  status: string; // "Present" or "Absent"
}

export default function AttendancePDFButton({ props: { roll_no, name } }: { props: { roll_no: number; name: string } }) {
  const [loading, setLoading] = useState(false);

  const generateAttendancePDF = async () => {
    setLoading(true);

    let data: AttendanceData[] = [];
      
    try {
      data = await fetchAttendancebyrollno(roll_no);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      setLoading(false);
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Student Attendance Report", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Student ID: ${roll_no}`, 14, 30);
    doc.text(`Student Name: ${name}`, 14, 34);
    doc.text(`Generated: ${new Date().toLocaleDateString()} BY ATTEND-EASE`, 14, 40);

    const tableData = data.map((entry, i) => [i + 1, entry.formatted_date, entry.status]);

    const presentCount = data.filter((d) => d.status === "Present").length;
    const total = data.length;
    const attendancePercent = total > 0 ? ((presentCount / total) * 100).toFixed(2) : "0.00";

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
        fillColor: '#E9758A',
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

    doc.save(`attendance-${roll_no}.pdf`);
    setLoading(false);
  };

  return (
    <button
      onClick={generateAttendancePDF}
      disabled={loading}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#E9758A',
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
