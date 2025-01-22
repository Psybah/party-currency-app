import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

export function CurrencyEditor({ currencyImage, onClose }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [text, setText] = useState("Celebration of Life");
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 400,
    });

    // Load the base currency template
    fabric.fabric.Image.fromURL(currencyImage, (img) => {
      img.scaleToWidth(fabricCanvas.width);
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [currencyImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.fabric.Image.fromURL(event.target.result, (img) => {
        // Create oval clip path
        const clipPath = new fabric.fabric.Ellipse({
          rx: 100,
          ry: 120,
          originX: 'center',
          originY: 'center'
        });

        img.set({
          left: 150,
          top: 150,
          clipPath: clipPath
        });
        
        // Scale image to fit within clip path
        img.scaleToWidth(200);
        
        canvas.add(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setPrimaryColor(color);
    
    // Apply color overlay
    const overlay = new fabric.fabric.Rect({
      width: canvas.width,
      height: canvas.height,
      fill: color,
      opacity: 0.2,
      globalCompositeOperation: 'color'
    });
    
    // Remove previous overlays
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.globalCompositeOperation === 'color') {
        canvas.remove(obj);
      }
    });
    
    canvas.add(overlay);
    canvas.renderAll();
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Update or create text object
    const objects = canvas.getObjects();
    const existingText = objects.find(obj => obj.type === 'text');
    
    if (existingText) {
      existingText.set('text', newText);
    } else {
      const textObject = new fabric.fabric.Text(newText, {
        left: 400,
        top: 300,
        fontFamily: 'Arial',
        fontSize: 40,
        fill: 'black',
        originX: 'center',
        originY: 'center'
      });
      canvas.add(textObject);
    }
    
    canvas.renderAll();
  };

  const handleSave = () => {
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    // Here you would typically send this to your backend
    // For now, let's just show a success message
    toast.success("Currency customization saved!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Customize Currency</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
          </div>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="image">Upload Portrait Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="color">Primary Color</Label>
              <Input
                id="color"
                type="color"
                value={primaryColor}
                onChange={handleColorChange}
                className="h-10 w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="text">Celebration Text</Label>
              <Input
                id="text"
                type="text"
                value={text}
                onChange={handleTextChange}
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleSave} className="bg-bluePrimary hover:bg-bluePrimary/90 text-white">
                Save Changes
              </Button>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}