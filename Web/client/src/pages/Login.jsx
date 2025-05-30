import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { getProfileApi, loginCustomerApi } from "@/api/authApi";
import { storeAuth } from "@/lib/util";
import { USER_PROFILE_CONTEXT, SIGNUP_CONTEXT } from "@/context";
import { formatErrorMessage } from "../utils/errorUtils";
import {
  showAuthSuccess,
  showAuthError,
  showValidationError,
} from "@/utils/feedback";
import { SocialAuthButtons } from "@/components/forms/SocialAuthButtons";

export default function LoginPage() {
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // New state for handling server errors
  const [serverErrors, setServerErrors] = useState({
    identifier: "",
    password: "",
    general: "",
  });

  const clearErrors = () => {
    setServerErrors({
      identifier: "",
      password: "",
      general: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    if (!identifier.includes("@")) {
      setServerErrors((prev) => ({
        ...prev,
        identifier: "Please enter a valid email address for login",
      }));
      showValidationError("Please enter a valid email address for login");
      setLoading(false);
      return;
    }

    try {
      const response = await loginCustomerApi(identifier, password);
      const data = await response.json();

      if (response.ok) {
        showAuthSuccess("Login successful! Welcome back.");
        console.log("Login successful:", data);
        const accessToken = data.token;

        // Store the access token in local storage or context
        storeAuth(accessToken, undefined, true);

        const userProfileResponse = await getProfileApi();
        if (userProfileResponse.ok) {
          const userProfileData = await userProfileResponse.json();
          console.log("Login - User Profile Data:", userProfileData);

          setUserProfile(userProfileData);

          let userType = "customer";

          // Check if user is admin type
          if (userProfileData.type?.toLowerCase() === "admin") {
            userType = "admin";
            console.log("Login - Detected admin user");
          }
          // Check if user is merchant type
          else if (userProfileData.type?.toLowerCase().startsWith("merchant")) {
            userType = "merchant";
            console.log("Login - Detected merchant user");
          }

          console.log("Login - Setting user type:", userType);

          // Store auth with user type
          storeAuth(accessToken, userType, true);

          // Redirect based on user type
          if (userType === "admin") {
            console.log("Login - Redirecting to admin dashboard");
            navigate("/admin/dashboard", { replace: true });
          } else if (userType === "merchant") {
            navigate("/merchant/virtual-account", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
          return;
        } else {
          throw new Error("Failed to fetch user profile.");
        }
      } else {
        const errorData = formatErrorMessage(data);
        console.log(
          "Login error response:",
          JSON.stringify(errorData, null, 2)
        );

        let hasSetError = false;

        // Handle different error structures
        if (errorData.error) {
          if (errorData.error.email || errorData.error.identifier) {
            const emailError =
              errorData.error.email || errorData.error.identifier;
            setServerErrors((prev) => ({
              ...prev,
              identifier: Array.isArray(emailError)
                ? emailError[0]
                : emailError,
            }));
            hasSetError = true;
          }

          if (errorData.error.password) {
            const passwordError = errorData.error.password;
            setServerErrors((prev) => ({
              ...prev,
              password: Array.isArray(passwordError)
                ? passwordError[0]
                : passwordError,
            }));
            hasSetError = true;
          }

          if (errorData.error.non_field_errors || errorData.error.detail) {
            const generalError =
              errorData.error.non_field_errors || errorData.error.detail;
            setServerErrors((prev) => ({
              ...prev,
              general: Array.isArray(generalError)
                ? generalError[0]
                : generalError,
            }));
            hasSetError = true;
          }
        } else if (errorData.detail) {
          setServerErrors((prev) => ({ ...prev, general: errorData.detail }));
          hasSetError = true;
        } else if (errorData.message) {
          setServerErrors((prev) => ({ ...prev, general: errorData.message }));
          hasSetError = true;
        }

        // If no specific errors were set, set a general error
        if (!hasSetError) {
          setServerErrors((prev) => ({
            ...prev,
            general:
              "Invalid credentials. Please check your email and password.",
          }));
        }

        showAuthError(
          serverErrors.general || "Login failed. Please try again."
        );
      }
    } catch (error) {
      showAuthError("Network error occurred. Please try again later.");
      setServerErrors((prev) => ({
        ...prev,
        general: "Network error occurred. Please try again later.",
      }));
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debug any errors
  useEffect(() => {
    if (Object.values(serverErrors).some((error) => error !== "")) {
      console.log("Current server errors:", serverErrors);
    }
  }, [serverErrors]);

  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen">
      <div className="top-4 left-4 md:left-8 absolute">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-black transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="ml-2 text-sm md:text-base">Back</span>
        </button>
      </div>

      <div className="space-y-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            width={60}
            height={60}
            className="mb-6"
          />
          <h1 className="font-playfair text-3xl">Welcome back!</h1>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2 text-left">
            <Label htmlFor="identifier">Email </Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className={`border-lightgray ${
                serverErrors.identifier ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
            />
            {serverErrors.identifier && (
              <p className="font-medium text-red-500 text-sm">
                {serverErrors.identifier}
              </p>
            )}
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`border-lightgray ${
                  serverErrors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {serverErrors.password && (
              <p className="font-medium text-red-500 text-sm">
                {serverErrors.password}
              </p>
            )}
          </div>

          {serverErrors.general && (
            <p className="font-medium text-red-500 text-sm">
              {serverErrors.general}
            </p>
          )}

          <Button
            type="submit"
            className="bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <SocialAuthButtons />

        <div className="space-y-2 text-center">
          <Link
            to="/forgot-password"
            className="text-muted-foreground text-sm hover:underline"
          >
            Forgotten password?
          </Link>
          <div className="text-sm">
            <span>New to Party Currency? </span>
            <button
              type="button"
              onClick={() => setSignupOpen(true)}
              className="text-gold hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
