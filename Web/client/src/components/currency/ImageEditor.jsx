import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CurrencyCanvas } from './CurrencyCanvas';
import AvatarEditor from 'react-avatar-editor';
import { debounce } from 'lodash';

export function ImageEditor({ side, currentImage, onClose, onSave, denomination }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1.2);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // const handleSave = () => {
  //   if (editor) {
  //     // Get the cropped canvas
  //     const canvas = editor.getImageScaledToCanvas();
  //     const ctx = canvas.getContext('2d');
      
  //     // Create mask based on side
  //     ctx.globalCompositeOperation = 'destination-in';
      
  //     if (side === 'front') {
  //       // Oval mask for front
  //       ctx.beginPath();
  //       ctx.ellipse(
  //         canvas.width / 2,
  //         canvas.height / 2,
  //         canvas.width / 2.2,
  //         canvas.height / 2.2,
  //         0,
  //         0,
  //         2 * Math.PI
  //       );
  //       ctx.fill();
  //     } else {
  //       // Rounded rectangle mask for back
  //       const radius = 40; // Increased from 30
  //       const width = canvas.width - 40;
  //       const height = canvas.height - 40;
  //       const x = 20;
  //       const y = 20;
        
  //       ctx.beginPath();
  //       ctx.moveTo(x + radius, y);
  //       ctx.lineTo(x + width - radius, y);
  //       ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  //       ctx.lineTo(x + width, y + height - radius);
  //       ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  //       ctx.lineTo(x + radius, y + height);
  //       ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  //       ctx.lineTo(x, y + radius);
  //       ctx.quadraticCurveTo(x, y, x + radius, y);
  //       ctx.closePath();
  //       ctx.fill();
  //     }
      
  //     const croppedImage = canvas.toDataURL();
  //     setPreviewUrl(croppedImage);
  //     onSave(croppedImage);
  //   }
  // };

  const handleSave = () => {
    if (editor) {
      // Get the cropped canvas
      const canvas = editor.getImageScaledToCanvas();
      const ctx = canvas.getContext('2d');
      
      // Create a new canvas for just the user's image
      const userImageCanvas = document.createElement('canvas');
      userImageCanvas.width = canvas.width;
      userImageCanvas.height = canvas.height;
      const userImageCtx = userImageCanvas.getContext('2d');
      
      // Draw the user's image
      userImageCtx.drawImage(canvas, 0, 0);
      
      // Create mask based on side
      userImageCtx.globalCompositeOperation = 'destination-in';
      
      if (side === 'front') {
        // Oval mask for front
        userImageCtx.beginPath();
        userImageCtx.ellipse(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2.2,
          canvas.height / 2.2,
          0,
          0,
          2 * Math.PI
        );
        userImageCtx.fill();
      } else {
        // Rounded rectangle mask for back
        const radius = 40;
        const width = canvas.width - 40;
        const height = canvas.height - 40;
        const x = 20;
        const y = 20;
        
        userImageCtx.beginPath();
        userImageCtx.moveTo(x + radius, y);
        userImageCtx.lineTo(x + width - radius, y);
        userImageCtx.quadraticCurveTo(x + width, y, x + width, y + radius);
        userImageCtx.lineTo(x + width, y + height - radius);
        userImageCtx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        userImageCtx.lineTo(x + radius, y + height);
        userImageCtx.quadraticCurveTo(x, y + height, x, y + height - radius);
        userImageCtx.lineTo(x, y + radius);
        userImageCtx.quadraticCurveTo(x, y, x + radius, y);
        userImageCtx.closePath();
        userImageCtx.fill();
      }
      
      // Get the masked image data URL
      const userImageDataUrl = userImageCanvas.toDataURL();
      setPreviewUrl(userImageDataUrl);
      onSave(userImageDataUrl);
    }
  };
  
  const handleScaleChange = debounce((newScale) => {
    setScale(parseFloat(newScale));
  }, 50);

  // Adjust editor dimensions based on side and screen size
  const getEditorDimensions = () => {
    // Get window width for responsive sizing
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    
    if (windowWidth <= 640) { // Small mobile screens
      return {
        width: side === 'front' ? 240 : 280,
        height: side === 'front' ? 310 : 180,
        borderRadius: side === 'front' ? 150 : 30
      };
    } else if (windowWidth <= 1024) { // Tablets and small laptops
      return {
        width: side === 'front' ? 280 : 380,
        height: side === 'front' ? 360 : 230,
        borderRadius: side === 'front' ? 180 : 35
      };
    } else { // Larger screens
      return {
        width: side === 'front' ? 300 : 450,
        height: side === 'front' ? 390 : 275,
        borderRadius: side === 'front' ? 200 : 40
      };
    }
  };

  const { width: editorWidth, height: editorHeight, borderRadius } = getEditorDimensions();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-lg w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[95vw] md:w-[90vw] md:max-w-4xl overflow-auto">
        <div className="sticky top-0 bg-white z-10 px-3 py-2 sm:p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              Change {side === 'front' ? 'Front' : 'Back'} Image
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Image Editor */}
            <div className="w-full">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Edit Image</h3>
              <div className="border border-gray-200 rounded-lg p-2 sm:p-4 flex justify-center">
                {selectedImage ? (
                  <div className="space-y-3 sm:space-y-4 max-w-full overflow-hidden">
                    <div className="relative flex justify-center">
                      <AvatarEditor
                        ref={(ref) => setEditor(ref)}
                        image={selectedImage}
                        width={editorWidth}
                        height={editorHeight}
                        border={20}
                        borderRadius={borderRadius}
                        color={[255, 255, 255, 0.6]}
                        scale={scale}
                        rotate={0}
                        className="max-w-full"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm text-gray-500">Zoom</p>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.01"
                        value={scale}
                        onChange={(e) => handleScaleChange(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 sm:p-8 bg-gray-50 rounded-lg w-full">
                    <p className="text-sm sm:text-base">
                      {side === 'front' 
                        ? 'Select an image for the oval portrait on the front' 
                        : 'Select an image for the rectangular frame on the back'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="w-full">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg p-2 sm:p-4">
                <CurrencyCanvas
                  templateImage={`/lovable-uploads/${denomination}-${side}-template.png`}
                  portraitImage={previewUrl}
                  side={side}
                  texts={{}}
                  denomination={denomination}
                />
              </div>
            </div>

            {/* Upload Controls */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="image" className="block mb-1 sm:mb-2 text-left text-sm sm:text-base">
                  Upload Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm sm:text-base"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1 text-left">
                  {side === 'front'
                    ? 'Recommended: Portrait image for oval frame, less than 5MB'
                    : 'Recommended: Landscape or square image for rectangular frame, less than 5MB'}
                </p>
              </div>

              <div className="flex justify-end gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!selectedImage}
                  className="bg-bluePrimary hover:bg-bluePrimary/90 text-white text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2"
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
