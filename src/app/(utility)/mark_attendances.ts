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

  if (
    typeof roll_number !== "string" ||
    typeof course_id !== "number" ||
    typeof name !== "string" ||
    !(status === STATUS.PRESENT || status === STATUS.ABSENT)
  ) {
    const errorMsg = "Invalid data: Please check the input fields.";
    console.error(errorMsg);
    return { success: false, message: errorMsg };
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

    if (!response.ok) {
      // server responded with error
      return { success: false, message: result.error || "Unknown server error" };
    }

    return { success: true, data: result };

  } catch (error: any) {
    console.log("Fetch error:", error);
    return { success: false, message: error.message || "Request failed" };
  }
}
