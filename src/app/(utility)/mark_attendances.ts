export enum STATUS {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export type Mark_attendance = {
  roll_number: string; // ✅ now a string
  status: STATUS;
  course_id: number;
  name: string;
};

export async function MARK_ATTENDANCE(mark_attendance_details: Mark_attendance) {
  console.log("RECEIVED DATA", mark_attendance_details);

  const { roll_number, status, course_id, name } = mark_attendance_details;

  // ✅ Validation checks
  if (
    typeof roll_number !== "string" ||
    typeof course_id !== "number" ||
    typeof name !== "string" ||
    !(status === STATUS.PRESENT || status === STATUS.ABSENT)
  ) {
    console.error("Invalid attendance data", mark_attendance_details);
    alert("Invalid data: Please check the input fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/mark_attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roll_number,
        course_id,
        name,
        status,
      }),
    });

    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error("Failed to mark attendance:", err);
    alert("Error sending attendance. Please try again.");
  }
}
