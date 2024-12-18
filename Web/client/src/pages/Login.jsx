import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            className="w-28 h-28 mb-4"
          />
          <h1 className="font-playfair text-3xl">Welcome back !</h1>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="border-lightgray"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="border-lightgray"
            />
          </div>

          <Button type="submit" className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D]">
            Sign in
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-lightgray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-lightgray">
              <img
                src="/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </Button>
            <Button variant="outline" className="border-lightgray">
              <img
                src="/apple.svg"
                alt="Apple"
                className="w-5 h-5 mr-2"
              />
              Apple
            </Button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <Link
            to="/forgot-password"
            className="text-sm text-muted-foreground hover:underline"
          >
            Forgotten password?
          </Link>
          <div className="text-sm">
            New to Party Currency?{" "}
            <Link to="/signup" className="text-gold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}