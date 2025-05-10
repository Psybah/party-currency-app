import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

export async function createEventApi(body) {
  const url = new URL("events/create", BASE_URL);
  const { accessToken } = getAuth();
  
  console.log("Sending event data to API:", body);
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${accessToken}`,
    },
    body: JSON.stringify({
      ...body,
      LGA: body.lga.toUpperCase(), // Convert lga to uppercase LGA as expected by backend
      reconciliation_service: Boolean(body.reconciliation_service),
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Failed to create event");
  }
  
  console.log("API Response:", data);
  return data;
}

// Get event by eventId
export async function getEventByEventId(eventId) {
  const url = new URL(`events/get/${eventId}`, BASE_URL);
  const { accessToken } = getAuth();
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get event");
  }

  return data.event;
}
