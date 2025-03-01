import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar } from "antd";
import { Upload, Camera } from "lucide-react";
import { profileService } from "../../services/profileService";
import toast from "react-hot-toast";

export function PhotoSection({ onUpdatePhoto }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const fetchProfilePicture = async () => {
    try {
      const data = await profileService.getProfilePicture();
      if (data && data.url) {
        setPreviewUrl(data.url);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }

      setIsLoading(true);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        await profileService.uploadProfilePicture(file);
        toast.success("Profile picture updated successfully");
        onUpdatePhoto && onUpdatePhoto(file);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to update profile picture");
        setPreviewUrl(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await profileService.uploadProfilePicture(null);
      setPreviewUrl(null);
      onUpdatePhoto && onUpdatePhoto(null);
      toast.success("Profile picture removed successfully");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error("Failed to remove profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-left font-playfair font-semibold">Profile Photo</h2>
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar
            size={100}
            src={previewUrl}
            icon={!previewUrl && <Camera className="w-8 h-8" />}
            className="bg-gray-100"
          />
          <Label
            htmlFor="photo-upload"
            className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
          </Label>
          <input
            type="file"
            id="photo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Recommended: Square image, less than 5MB
          </p>
          {previewUrl && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700"
            >
              Remove Photo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}