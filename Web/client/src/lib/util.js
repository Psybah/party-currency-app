import { ACCESS_TOKEN_DURATION } from "@/config";
import Cookies from "js-cookie";

export function storeAuth(
  accessToken,
  userType = "customer",
  rememberMe = true
) {
  // Supertype can be 'customer' or 'merchant'
  localStorage.setItem("userType", userType);

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
