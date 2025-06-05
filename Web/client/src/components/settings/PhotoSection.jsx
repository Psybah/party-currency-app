import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar } from "antd";
import { Upload, Camera } from "lucide-react";
import { uploadProfilePicture } from "../../api/profileApi";
import { getDriveImage } from "@/api/utilApi";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { getProfilePicture } from "../../api/profileApi";

export function PhotoSection({ onUpdatePhoto }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [driveUrl, setDriveUrl] = useState(null);

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const fetchProfilePicture = async () => {
    setIsLoading(true);
    try {
      const data = await getProfilePicture();
      if (data && data.profile_picture) {
        setDriveUrl(data.profile_picture);
        const objectUrl = await getDriveImage(data.profile_picture);
        setPreviewUrl(objectUrl);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      toast.error("Failed to load profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }

      setIsUploading(true);
      try {
        // Show local preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        const response = await uploadProfilePicture(file);
        if (response.profile_picture) {
          setDriveUrl(response.profile_picture);
          const objectUrl = await getDriveImage(response.profile_picture);
          setPreviewUrl(objectUrl);
          toast.success("Profile picture updated successfully");
          onUpdatePhoto && onUpdatePhoto(response.profile_picture);
        } else {
          throw new Error("No profile picture URL in response");
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to update profile picture");
        await fetchProfilePicture(); // Refresh the current picture
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Cleanup object URLs when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        <h2 className="text-xl sm:text-2xl text-left font-playfair font-semibold">Profile Photo</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 lg:gap-6">
          <Skeleton className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full" />
          <div className="space-y-2 text-center sm:text-left">
            <Skeleton className="h-3 sm:h-4 w-[150px] sm:w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <h2 className="text-xl sm:text-2xl text-left font-playfair font-semibold">Profile Photo</h2>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 lg:gap-6">
        <div className="relative">
          <Avatar
            size={window.innerWidth < 640 ? 80 : 100}
            src={previewUrl}
            icon={!previewUrl && <Camera className="w-6 h-6 sm:w-8 sm:h-8" />}
            className="bg-gray-100"
          />
          <Label
            htmlFor="photo-upload"
            className={`absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 p-1 sm:p-1.5 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
          </Label>
          <input
            type="file"
            id="photo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-500">
            Recommended: Square image, less than 5MB
          </p>
          {isUploading && (
            <p className="text-xs sm:text-sm text-gray-500">Uploading profile picture...</p>
          )}
        </div>
      </div>
    </div>
  );
}

PhotoSection.propTypes = {
  onUpdatePhoto: PropTypes.func,
};