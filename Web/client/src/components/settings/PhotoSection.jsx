import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar } from "antd";
import { Upload, Camera } from "lucide-react";

export function PhotoSection({ onUpdatePhoto }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onUpdatePhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    onUpdatePhoto(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-left font-semibold">Profile Photo</h2>
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
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-left text-gray-600">
            Upload a new profile photo or delete the existing one.
          </p>
          {previewUrl && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="mt-2"
            >
              Delete Photo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}