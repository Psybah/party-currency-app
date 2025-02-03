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
  const eventId = "1A3Bc5674F89djfnk"; // Fixed event ID

  // Define canvas dimensions and positions
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 600;
  const PORTRAIT_SIZE = { width: 200, height: 240 };
  
  // Text position configurations
  const textConfig = {
    celebration: {
      x: CANVAS_WIDTH * 0.7,
      y: CANVAS_HEIGHT * 0.3,
      fontSize: 48,
      fontFamily: 'Playfair Display'
    },
    currency: {
      x: CANVAS_WIDTH * 0.8,
      y: CANVAS_HEIGHT * 0.8,
      fontSize: 32,
      fontFamily: 'Montserrat'
    },
    eventId: {
      x: CANVAS_WIDTH - 50,
      y: CANVAS_HEIGHT * 0.5,
      fontSize: 24,
      angle: 90,
      fontFamily: 'Montserrat',
      fill: '#D4AF37'
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log("Initializing canvas with dimensions:", CANVAS_WIDTH, CANVAS_HEIGHT);

    const fabricCanvas = new fabric.fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff'
    });

    // Scale canvas for responsive display
    const scaleCanvas = () => {
      const container = document.querySelector('.canvas-container');
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      const scale = containerWidth / CANVAS_WIDTH;
      
      fabricCanvas.setZoom(scale);
      fabricCanvas.setWidth(containerWidth);
      fabricCanvas.setHeight(CANVAS_HEIGHT * scale);
      fabricCanvas.renderAll();
      
      console.log("Canvas scaled with ratio:", scale);
    };

    // Load and setup background template
    fabric.fabric.Image.fromURL(currencyImage, (img) => {
      img.scaleToWidth(fabricCanvas.width);
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
      
      // Create oval portrait frame
      const clipPath = new fabric.fabric.Ellipse({
        left: 150,
        top: CANVAS_HEIGHT / 2,
        rx: PORTRAIT_SIZE.width / 2,
        ry: PORTRAIT_SIZE.height / 2,
        originX: 'center',
        originY: 'center',
        fill: 'transparent',
        stroke: '#D4AF37',
        strokeWidth: 3
      });
      fabricCanvas.add(clipPath);

      // Add event ID text vertically
      const eventIdText = new fabric.fabric.Text(eventId, {
        left: textConfig.eventId.x,
        top: textConfig.eventId.y,
        angle: textConfig.eventId.angle,
        fontSize: textConfig.eventId.fontSize,
        fontFamily: textConfig.eventId.fontFamily,
        fill: textConfig.eventId.fill,
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      fabricCanvas.add(eventIdText);

      console.log("Template and initial elements added to canvas");
    });

    setCanvas(fabricCanvas);
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener('resize', scaleCanvas);
    };
  }, [currencyImage, eventId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Processing image upload");

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.fabric.Image.fromURL(event.target.result, (img) => {
        const clipPath = new fabric.fabric.Ellipse({
          rx: PORTRAIT_SIZE.width / 2,
          ry: PORTRAIT_SIZE.height / 2,
          originX: 'center',
          originY: 'center'
        });

        img.set({
          left: 150,
          top: CANVAS_HEIGHT / 2,
          clipPath: clipPath,
          originX: 'center',
          originY: 'center'
        });
        
        img.scaleToWidth(PORTRAIT_SIZE.width);
        canvas.add(img);
        canvas.renderAll();
        
        console.log("Portrait image added to canvas");
      });
    };
    reader.readAsDataURL(file);
  };

  const updateText = (type, value) => {
    if (!canvas) return;

    console.log("Updating text:", type, value);

    const config = textConfig[type];
    const objects = canvas.getObjects();
    const existingText = objects.find(obj => obj.type === 'text' && obj.textType === type);
    
    if (existingText) {
      existingText.set({
        text: value,
        left: config.x,
        top: config.y,
        fontSize: config.fontSize,
        fontFamily: config.fontFamily,
        fill: config.fill || '#000000'
      });
    } else {
      const textObject = new fabric.fabric.Text(value, {
        left: config.x,
        top: config.y,
        fontSize: config.fontSize,
        fontFamily: config.fontFamily,
        fill: config.fill || '#000000',
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
    
    console.log("Currency design saved");
    toast.success("Currency customization saved!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-left">Customize Currency</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="canvas-container w-full overflow-hidden border border-gray-200 rounded-lg bg-white">
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
                <p className="text-sm text-gray-500 mt-1">
                  Upload an image for the oval portrait area
                </p>
              </div>
              
              <Button onClick={handleSave} className="w-full bg-bluePrimary hover:bg-bluePrimary/90 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}