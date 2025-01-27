import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

export async function createEvent(eventData) {
  try {
    const { accessToken } = getAuth();
    if (!accessToken) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/events/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${accessToken}`,
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create event");
    }

    return data;
  } catch (error) {
    console.error("Create event error:", error);
    throw error;
  }
}

export async function getEvents() {
  const { accessToken } = getAuth();
  
  if (!accessToken) {
    throw new Error("Please log in to view your events");
  }

  const response = await fetch(`${BASE_URL}/events/list`, {
    headers: {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    }
    throw new Error("Failed to fetch events. Please try again later.");
  }

  return response.json();
}
