import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

export function CurrencyEditor({ currencyImage, onClose }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [celebrationText, setCelebrationText] = useState("Happy Birthday!");
  const [currencyName, setCurrencyName] = useState("Party Currency");
  const [eventId, setEventId] = useState("1A3Bc5674F89djfnk");

  // Text position configurations
  const textPositions = {
    celebration: { x: 400, y: 150 },
    currency: { x: 400, y: 300 },
    eventId: { x: 400, y: 350 }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 400,
      backgroundColor: '#ffffff'
    });

    // Scale canvas for mobile responsiveness
    const scaleCanvas = () => {
      const container = document.querySelector('.canvas-container');
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      const scale = containerWidth / 800;
      
      fabricCanvas.setZoom(scale);
      fabricCanvas.setWidth(containerWidth);
      fabricCanvas.setHeight(400 * scale);
    };

    // Load the template image
    fabric.fabric.Image.fromURL(currencyImage, (img) => {
      img.scaleToWidth(fabricCanvas.width);
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
    });

    setCanvas(fabricCanvas);
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener('resize', scaleCanvas);
    };
  }, [currencyImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.fabric.Image.fromURL(event.target.result, (img) => {
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
        
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const updateText = (type, value) => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const existingText = objects.find(obj => obj.type === 'text' && obj.textType === type);
    
    const position = textPositions[type];
    const fontFamily = type === 'celebration' ? 'Playfair Display' : 
                      type === 'currency' ? 'Montserrat' : 'Montserrat';
    const fontSize = type === 'celebration' ? 40 : 24;
    
    if (existingText) {
      existingText.set({
        text: value,
        fill: '#000000', // Black text color
        left: position.x,
        top: position.y,
        fontFamily: fontFamily,
        fontSize: fontSize
      });
    } else {
      const textObject = new fabric.fabric.Text(value, {
        left: position.x,
        top: position.y,
        fontFamily: fontFamily,
        fontSize: fontSize,
        fill: '#000000', // Black text color
        originX: 'center',
        originY: 'center',
        textType: type
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
    
    toast.success("Currency customization saved!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-left">Customize Currency</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="canvas-container w-full overflow-hidden border border-gray-200 rounded-lg">
              <canvas ref={canvasRef} />
            </div>
            
            <div className="space-y-6">
              <div className="text-left">
                <Label htmlFor="celebration" className="block mb-2">
                  Celebration Text
                </Label>
                <Input
                  id="celebration"
                  value={celebrationText}
                  onChange={(e) => {
                    setCelebrationText(e.target.value);
                    updateText('celebration', e.target.value);
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Position: Top center (x: {textPositions.celebration.x}, y: {textPositions.celebration.y})
                </p>
              </div>
              
              <div className="text-left">
                <Label htmlFor="currency" className="block mb-2">
                  Currency Name
                </Label>
                <Input
                  id="currency"
                  value={currencyName}
                  onChange={(e) => {
                    setCurrencyName(e.target.value);
                    updateText('currency', e.target.value);
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Position: Bottom center (x: {textPositions.currency.x}, y: {textPositions.currency.y})
                </p>
              </div>
              
              <div className="text-left">
                <Label htmlFor="eventId" className="block mb-2">
                  Event ID*
                </Label>
                <Input
                  id="eventId"
                  value={eventId}
                  onChange={(e) => {
                    setEventId(e.target.value);
                    updateText('eventId', e.target.value);
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Position: Bottom right (x: {textPositions.eventId.x}, y: {textPositions.eventId.y})
                </p>
              </div>

              <div className="text-left">
                <Label htmlFor="image" className="block mb-2">
                  Upload Portrait Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              
              <Button onClick={handleSave} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}