import { ACCESS_TOKEN_DURATION } from "@/config";
import Cookies from "js-cookie";

export function storeAuth(
  accessToken,
  userType = "customer",
  rememberMe = true
) {
  // Ensure userType is stored correctly
  localStorage.setItem("userType", userType);
  console.log('Storing auth - userType:', userType);

  if (rememberMe) {
    Cookies.set("accessToken", accessToken, { expires: ACCESS_TOKEN_DURATION });
  } else {
    // deletes automatically when the user exits the browser
    Cookies.set("accessToken", accessToken);
  }
}

export function getAuth() {
  const accessToken = Cookies.get("accessToken");
  const userType = localStorage.getItem("userType");

  return { accessToken, userType };
}
export function deleteAuth() {
  Cookies.remove("accessToken");
}

export const clearAllAuth = () => {
  // Clear all localStorage items
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('resetToken');
  
  // Clear session storage
  sessionStorage.clear();
  
  // Clear cookies using js-cookie
  Cookies.remove('accessToken');
  Cookies.remove('token');
  
  // Force clear any other cookies
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    Cookies.remove(cookieName);
  });
};
