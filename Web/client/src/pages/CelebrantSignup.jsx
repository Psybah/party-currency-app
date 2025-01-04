import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { signupCelebrantApi, getProfileApi } from "@/services/apiAuth";
import { storeAuth } from "@/lib/util";
import { USER_PROFILE_CONTEXT } from "@/context";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Lucide icons

export default function CelebrantSignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { userProfile, setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const response = await signupCelebrantApi(
      firstName,
      lastName,
      email,
      password,
      phone
    );
    if (!response.ok) {
      const errorData = await response.json();
      const message = JSON.stringify(Object.values(errorData)[0]);
      setError(message || "Signup failed");
      console.error("Signup failed:", response);
      return;
    }
    const responseData = await response.json();
    console.log("Signup successful:", responseData);
    const accessToken = responseData.token; // Get the token from API response
    // Store token in cookies and user type in local storage
    storeAuth(accessToken, "customer", true);

    // Fetch user profile using the access token
    const userProfileResponse = await getProfileApi();
    if (userProfileResponse.ok) {
      const userProfileData = await userProfileResponse.json();
      setUserProfile(userProfileData); // Update user profile context
      console.log("User profile fetched:", userProfileData);
      navigate("/dashboard"); // Redirect to dashboard
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen">
      {/* Back Button */}
      <div className="absolute top-4 left-4 md:left-8">
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
      <div className="space-y-6 w-full max-w-md"> {/* Reduced space-y-8 to space-y-6 */}
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            width={60}
            height={60}
            className="mb-4"
          />
          <h1 className="font-playfair text-3xl">
            Sign up as Host/Event planner
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="gap-4 grid grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                className="border-lightgray"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="border-lightgray"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="border-lightgray"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="border-lightgray pr-10"
                value={password}
                min={8}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" /> // Lucide EyeOff icon
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" /> // Lucide Eye icon
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="border-lightgray pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" /> // Lucide EyeOff icon
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" /> // Lucide Eye icon
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234..."
              className="border-lightgray"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            className="bg-footer hover:bg-[#2D2D2D] w-full"
          >
            Create an account
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="border-t border-lightgray w-full"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="gap-4 grid grid-cols-2">
            <Button variant="outline" className="border-lightgray">
              <img src="/google.svg" alt="Google" className="mr-2 w-5 h-5" />
              Google
            </Button>
            <Button variant="outline" className="border-lightgray">
              <img src="/apple.svg" alt="Apple" className="mr-2 w-5 h-5" />
              Apple
            </Button>
          </div>
        </div>

        <div className="text-center text-sm">
          By clicking "Create an Account" above, you acknowledge that you have read, 
          understood, and agree to Party Currency's{" "}
          <Link to="/terms" className="text-gold hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-gold hover:underline">
            Privacy Policy
          </Link>
          .
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}