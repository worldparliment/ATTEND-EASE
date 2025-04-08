export async function decode(token: string): Promise<any> {
  const response = await fetch("/decode_token", { // ✅ USE /api/
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Decode API failed: ${response.status} - ${errorText}`);
  }

  return await response.json(); // should return { course_id: number }
}
