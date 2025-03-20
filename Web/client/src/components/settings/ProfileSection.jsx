import React, { useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { USER_PROFILE_CONTEXT } from "@/context";
import { showSuccess, showError, withFeedback } from "@/utils/feedback";

export function ProfileSection({ onUpdate }) {
  const { userProfile } = useContext(USER_PROFILE_CONTEXT);
  const [firstName, setFirstName] = React.useState(
    userProfile?.firstname || ""
  );
  const [lastName, setLastName] = React.useState(userProfile?.lastname || "");
  const [email, setEmail] = React.useState(userProfile?.email || "");
  const [phone, setPhone] = React.useState(userProfile?.phone || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Using withFeedback to handle the async operation with toast feedback
      await withFeedback(
        () => onUpdate({ firstName, lastName, email, phone }),
        {
          loadingMessage: "Updating your profile...",
          successMessage: "Profile updated successfully!",
          // transform is optional if you need to transform the result
          transform: (result) => {
            // You can manipulate the result here if needed
            return result;
          },
        }
      );
    } catch (error) {
      // This should not be reached as withFeedback handles errors
      showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-playfair font-semibold text-2xl text-left">
        Personal Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-2 text-left">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <Button
          type="submit"
          className="bg-gold w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
