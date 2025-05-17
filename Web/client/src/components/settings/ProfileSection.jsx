import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { USER_PROFILE_CONTEXT } from "@/context";
import { showSuccess, showError, withFeedback } from "@/utils/feedback";
import { updateProfile } from "@/api/profileApi";


export function ProfileSection() {
  const { userProfile, setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const [firstName, setFirstName] = useState(userProfile?.firstname || "");
  const [lastName, setLastName] = useState(userProfile?.lastname || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [phone, setPhone] = useState(userProfile?.phonenumber || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await withFeedback(
        async () => {
          const response = await updateProfile({
            firstname: firstName,
            lastname: lastName,
            phonenumber: phone,
          });
          setUserProfile({ ...userProfile, ...response });
          setIsEditing(false);
          return response;
        },
        {
          loadingMessage: "Updating your profile...",
          successMessage: "Profile updated successfully!",
          errorMessage: "Failed to update profile",
        }
      );
    } catch (error) {
      showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="font-playfair font-semibold text-2xl text-left">
          Personal Information
        </h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="text-gold border-gold hover:bg-gold hover:text-white"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-2 text-left">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled={true}
            className="bg-gray-100"
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
            disabled={!isEditing}
          />
        </div>
        {isEditing && (
          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-gold w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => {
                setIsEditing(false);
                setFirstName(userProfile?.firstname || "");
                setLastName(userProfile?.lastname || "");
                setPhone(userProfile?.phone || "");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
