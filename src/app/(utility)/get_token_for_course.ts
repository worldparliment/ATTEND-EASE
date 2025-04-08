export async function get_token_for_course(course_id: number): Promise<string> {
  try {
    const response = await fetch("/set_course_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the token actually exists in response
    if (!data.token) {
      throw new Error("Token not found in response");
    }

    return data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error; // Re-throw so caller can handle
  }
}
