import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

export async function getEvents() {
  console.log("Fetching events..."); // Debug log
  
  const { accessToken } = getAuth();
  
  if (!accessToken) {
    throw new Error("Please log in to view your events");
  }

  try {
    const response = await fetch(`${BASE_URL}/events/list`, {
      headers: {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Events API response status:", response.status); // Debug log

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }
      throw new Error("Failed to fetch events. Please try again later.");
    }

    const data = await response.json();
    console.log("Events API response data:", data); // Debug log

    return data;
  } catch (error) {
    console.error("Error in getEvents:", error); // Debug log
    throw error;
  }
}