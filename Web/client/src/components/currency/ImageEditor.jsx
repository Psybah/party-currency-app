import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CurrencyCanvas } from './CurrencyCanvas';

export function ImageEditor({ side, currentImage, onClose, onSave }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setSelectedImage(file);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (previewUrl) {
      onSave(previewUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Change {side === 'front' ? 'Front' : 'Back'} Image</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <CurrencyCanvas
                  templateImage={`/lovable-uploads/200-${side}-template.png`}
                  portraitImage={previewUrl}
                  side={side}
                  texts={{}} // Empty texts for image preview
                />
              </div>
            </div>

            {/* Upload Controls */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="image" className="block mb-2">
                  Upload Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: Square image, less than 5MB
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!selectedImage}
                  className="bg-bluePrimary hover:bg-bluePrimary/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
