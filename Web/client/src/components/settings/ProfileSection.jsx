import React, { useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { USER_PROFILE_CONTEXT } from "@/context";

export function ProfileSection({ onUpdate }) {
  const { userProfile } = useContext(USER_PROFILE_CONTEXT);
  const [firstName, setFirstName] = React.useState(userProfile?.firstname || "");
  const [lastName, setLastName] = React.useState(userProfile?.lastname || "");
  const [email, setEmail] = React.useState(userProfile?.email || "");
  const [phone, setPhone] = React.useState(userProfile?.phone || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ firstName, lastName, email, phone });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-left font-playfair font-semibold">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-left space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="text-left space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
        </div>
        <div className="text-left space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="text-left space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <Button type="submit" className="w-full bg-gold md:w-auto">
          Update Profile
        </Button>
      </form>
    </div>
  );
}