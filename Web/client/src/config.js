export const BASE_URL = "https://party-currency-app-production-5074.up.railway.app";

const redirectUri = `${BASE_URL}/auth/google/callback`;
// 14 Days for access token
export const ACCESS_TOKEN_DURATION = 14;

export const googleAuthUrl = `${BASE_URL}/auth/google`;

export const DENOMINATION_CHOICES = [
  {
    value: 100,
    label: "100"
  },
  {
    value: 200,
    label: "200"
  },
  {
    value: 500,
    label: "500"
  },
  {
    value: 1000,
    label: "1000"
  }
]