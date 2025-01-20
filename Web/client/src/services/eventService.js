import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";
import toast from "react-hot-toast";

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
  try {
    const { accessToken } = getAuth();
    if (!accessToken) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/events/list`, {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch events");
    }

    return data;
  } catch (error) {
    console.error("Fetch events error:", error);
    throw error;
  }
}