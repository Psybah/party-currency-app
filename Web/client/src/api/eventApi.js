import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";
export async function createEventApi(body) {
  const url = new URL("events/create", BASE_URL);
  const { accessToken } = getAuth();
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
}
