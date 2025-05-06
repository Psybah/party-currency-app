export const BASE_URL = "https://party-currency-app-production-70c0.up.railway.app";
export const API_BASE_URL = `${BASE_URL}/api`;

const redirectUri = `${BASE_URL}/auth/google/callback`;
// 14 Days for access token
export const ACCESS_TOKEN_DURATION = 14;
export const GOOGLE_CLIENT_ID =
  "621426618829-lrjj3u2qls3qa8ij8e5hhdkh97tfuhpo.apps.googleusercontent.com";

const scope =
  "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
export const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
