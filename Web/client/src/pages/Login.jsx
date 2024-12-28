import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { SIGNUP_CONTEXT } from "../context";

export default function LoginPage() {
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://6177-105-113-98-202.ngrok-free.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        console.log("Login successful", data);
        // You can save the token in localStorage or context for later use
        localStorage.setItem("authToken", data.token);
        // Redirect user or update UI state
      } else {
        // Handle errors
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen">
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
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="border-lightgray"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="border-lightgray"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <Button
            type="submit"
            className="bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
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

        <div className="space-y-2 text-center">
          <Link
            to="/forgot-password"
            className="text-muted-foreground text-sm hover:underline"
          >
            Forgotten password?
          </Link>
          <div className="text-sm">
            New to Party Currency?{" "}
            <p
              onClick={() => {
                setSignupOpen(true);
              }}
              className="text-gold hover:underline"
            >
              Sign up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
