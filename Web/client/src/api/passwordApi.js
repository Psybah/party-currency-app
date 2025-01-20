import { BASE_URL } from "@/config";

export async function requestPasswordResetCode(email) {
  return fetch(`${BASE_URL}/auth/password/code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}

export async function getPasswordResetToken(email) {
  return fetch(`${BASE_URL}/auth/password/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(email, password) {
  return fetch(`${BASE_URL}/auth/password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}