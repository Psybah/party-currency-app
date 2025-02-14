import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { ProfileSection } from "../components/settings/ProfileSection";
import { SecuritySection } from "../components/settings/SecuritySection";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "../components/LoadingDisplay";
import toast from "react-hot-toast";
import { PhotoSection } from "../components/settings/PhotoSection";

export default function Settings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handlePasswordUpdate = async (passwordData) => {
    try {
      // API call to update password would go here
      console.log("Updating password");
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password");
    }
  };

  const handlePhotoUpdate = async (file) => {
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
    <div className="min-h-screen bg-white">
      <DashboardSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <div className="md:pl-64">
        <DashboardHeader 
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <PhotoSection onUpdatePhoto={handlePhotoUpdate} />
            <ProfileSection onUpdate={handleProfileUpdate} />
            <SecuritySection onUpdatePassword={handlePasswordUpdate} />
          </div>
        </main>
      </div>
    </div>
  );
}