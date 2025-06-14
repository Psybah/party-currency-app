import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { USER_PROFILE_CONTEXT } from "@/context";
import { showError, withFeedback } from "@/utils/feedback";
import { updateProfile } from "@/api/profileApi";

export function ProfileSection() {
  const { userProfile, setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const [firstName, setFirstName] = useState(userProfile?.firstname || "");
  const [lastName, setLastName] = useState(userProfile?.lastname || "");
  const [email] = useState(userProfile?.email || "");
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
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="font-playfair font-semibold text-xl sm:text-2xl text-left">
          Personal Information
        </h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="text-gold border-gold hover:bg-gold hover:text-white w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="gap-3 sm:gap-4 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-1.5 sm:space-y-2 text-left">
            <Label htmlFor="firstName" className="text-sm sm:text-base">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              disabled={!isEditing}
              className="h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2 text-left">
            <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              disabled={!isEditing}
              className="h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="space-y-1.5 sm:space-y-2 text-left">
          <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled={true}
            className="bg-gray-100 h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>
        <div className="space-y-1.5 sm:space-y-2 text-left">
          <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            disabled={!isEditing}
            className="h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              type="submit"
              className="bg-gold w-full md:w-auto h-9 sm:h-10 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-auto h-9 sm:h-10 text-sm sm:text-base"
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

ProfileSection.propTypes = {
  onUpdate: PropTypes.func,
};
