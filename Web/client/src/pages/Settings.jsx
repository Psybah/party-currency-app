import { ProfileSection } from "../components/settings/ProfileSection";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "../components/LoadingDisplay";
import toast from "react-hot-toast";
import { PhotoSection } from "../components/settings/PhotoSection";

export default function Settings() {
  const authenticated = useAuthenticated();

  const handleProfileUpdate = async (profileData) => {
    try {
      // API call to update profile would go here
      console.log("Updating profile with:", profileData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePhotoUpdate = async () => {
    try {
      // The actual API call is now handled in the PhotoSection component
      // This is just for any additional state updates or UI feedback
      console.log("Photo update completed");
    } catch (error) {
      console.error("Photo update error:", error);
      toast.error("Failed to update photo");
    }
  };

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 mx-auto max-w-4xl">
          <PhotoSection onUpdatePhoto={handlePhotoUpdate} />
          <ProfileSection onUpdate={handleProfileUpdate} />
        </div>
      </main>
    </div>
  );
}
