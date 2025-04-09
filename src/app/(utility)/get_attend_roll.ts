export async function fetchAttendancebyrollno(roll_no:number) {
    const res = await fetch('/get_attend_roll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roll_no: roll_no }),
    });
  
    const data = await res.json();
    return data;
  }
  