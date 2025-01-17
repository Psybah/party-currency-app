import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            width={60}
            height={60}
            className="mb-4"
          />
          <h1 className="font-playfair text-3xl">Reset Password</h1>
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
            <Label htmlFor="confirmEmail">Confirm Email</Label>
            <Input
              id="confirmEmail"
              type="email"
              placeholder="example@gmail.com"
              className="border-lightgray"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resetCode">Enter reset code</Label>
            <div className="flex gap-2">
              <Input
                id="resetCode"
                placeholder="1a2B86hx01kl"
                className="border-lightgray"
              />
              <Button variant="outline" className="whitespace-nowrap border-lightgray">
                Get code
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D]">
            Confirm code
          </Button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm text-muted-foreground hover:underline">
            Back to sign in page
          </Link>
        </div>
      </div>
    </div>
  )
}
