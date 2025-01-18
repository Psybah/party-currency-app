import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";

export async function loginCustomerApi(email, password) {
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function signupCelebrantApi(
  first_name,
  last_name,
  email,
  password,
  phone_number
) {
  return fetch(`${BASE_URL}/auth/signup/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      phone_number,
    }),
  });
}

export async function getProfileApi() {
  const { accessToken } = getAuth();
  if (!accessToken) {
    throw new Error("No access token found");
  }
  
  return fetch(`${BASE_URL}/users/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Token ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
}

export async function signupMerchantApi(values) {
  return fetch(`${BASE_URL}/auth/signup/merchant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      password: values.password,
      business_type: values.businessType,
      country: values.country,
      state: values.state,
      city: values.city,
      phone_number: values.phoneNumber,
    }),
  });
}