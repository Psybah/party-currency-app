import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

/**
 * Creates a new event
 * @param {Object} body - Event data
 * @returns {Promise<Object>} - Created event data
 * @throws {Error} If request fails
 */
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

/**
 * Gets event by event ID
 * @param {string} eventId - ID of the event to fetch
 * @returns {Promise<Object>} - Event data
 * @throws {Error} If request fails
 */
export async function getEventById(eventId) {
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

/**
 * Gets all events for the current user
 * @returns {Promise<Array<{event_id: string, event_name: string}>>} - List of events with their IDs and names
 * @throws {Error} If authentication is missing or request fails
 */
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

export async function getCurrenciesByEventId(eventId) {
  const { accessToken } = getAuth();

  try {
    const response = await fetch(
      `${BASE_URL}/events/get-currency?event_id=${eventId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch currencies");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw error;
  }
}
export async function deleteEvent(eventId) {
  const { accessToken } = getAuth();

  try {
    const response = await fetch(`${BASE_URL}/events/delete/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete event. Please try again later.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}
