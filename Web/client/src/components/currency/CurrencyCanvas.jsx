import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

// Currency dimensions (aspect ratio from the design)
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 800;

const CURRENCY_AMOUNTS = {
  '200': 'Two Hundred',
  '500': 'Five Hundred',
  '1000': 'One Thousand'
};

export function CurrencyCanvas({ 
  templateImage,
  texts = {},
  portraitImage = null,
  side = 'front',
  denomination = '200',
  onReady = () => {},
}) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  // Text positions and styles
  const textConfig = {
    front: {
      currencyName: {
        x: CANVAS_WIDTH * 0.6,
        y: CANVAS_HEIGHT * 0.3,
        fontSize: 90,
        fontFamily: 'Tangerine',
      },
      denominationText: {
        x: CANVAS_WIDTH * 0.6,
        y: CANVAS_HEIGHT * 0.2,
        fontSize: 90,
        fontFamily: 'Tangerine',
        fill: '#000000',
      },
      celebration: {
        x: CANVAS_WIDTH * 0.59,
        y: CANVAS_HEIGHT * 0.85,
        fontSize: 70,
        fontFamily: 'Playfair Display',
      },
      eventId: {
        x: CANVAS_WIDTH - 50,
        y: CANVAS_HEIGHT * 0.5,
        fontSize: 24,
        fontFamily: 'Montserrat',
        angle: 90,
        fill: '#D4AF37',
      },
    },
    back: {
      celebration: {
        x: CANVAS_WIDTH * 0.75,
        y: CANVAS_HEIGHT * 0.85,
        fontSize: 48,
        fontFamily: 'Playfair Display',
      },
    },
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new canvas element and initialize fabric
    const canvasEl = canvasRef.current;
    canvasEl.width = CANVAS_WIDTH;
    canvasEl.height = CANVAS_HEIGHT;

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const canvas = new fabric.Canvas(canvasEl, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: '#ffffff',
        selection: false,
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;

      // Scale canvas function
      const scaleCanvas = () => {
        const container = canvas.wrapperEl?.parentNode;
        if (!container) return;

        const containerWidth = container.offsetWidth;
        const scale = containerWidth / CANVAS_WIDTH;

        // Fix for the scaling issue
        canvas.setWidth(containerWidth);
        canvas.setHeight(CANVAS_HEIGHT * scale);
        canvas.setZoom(scale);
        canvas.renderAll();
      };

      // Initial render
      canvas.renderAll();
      
      // Load template image
      if (templateImage) {
        fabric.Image.fromURL(templateImage, (img) => {
          if (!img) {
            console.error('Failed to load image:', templateImage);
            return;
          }
          img.scaleToWidth(canvas.width);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          
          // Make sure to call scaleCanvas after setting background image
          setTimeout(scaleCanvas, 0);
        });
      }

      // Add resize listener
      window.addEventListener('resize', scaleCanvas);

      // Cleanup
      return () => {
        window.removeEventListener('resize', scaleCanvas);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }
      };
    }, 0);
  }, [templateImage]);

  // Update texts when they change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Clear existing texts
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.type === 'text') {
        canvas.remove(obj);
      }
    });

    // Add denomination text first (uneditable)
    if (side === 'front') {
      const denominationText = new fabric.Text(CURRENCY_AMOUNTS[denomination], {
        left: textConfig.front.denominationText.x,
        top: textConfig.front.denominationText.y,
        fontSize: textConfig.front.denominationText.fontSize,
        fontFamily: textConfig.front.denominationText.fontFamily,
        fill: textConfig.front.denominationText.fill,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      canvas.add(denominationText);
    }

    // Add other texts
    Object.entries(texts).forEach(([key, value]) => {
      if (!value || !textConfig[side][key]) return;

      const config = textConfig[side][key];
      const text = new fabric.Text(value, {
        left: config.x,
        top: config.y,
        fontSize: config.fontSize,
        fontFamily: config.fontFamily,
        fill: config.fill || '#000000',
        angle: config.angle || 0,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      canvas.add(text);
    });

    canvas.renderAll();
  }, [texts, side, denomination]);

  // Update portrait image when it changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !portraitImage) return;

    // Remove existing portrait
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.type === 'image') {
        canvas.remove(obj);
      }
    });

    // Add new portrait based on side
    if (side === 'front') {
      // Front side - oval portrait
      fabric.Image.fromURL(portraitImage, (img) => {
        const clipPath = new fabric.Ellipse({
          rx: 270,
          ry: 350,
          originX: 'center',
          originY: 'center',
        });

        // Calculate scaling to fill the oval
        const scaleX = (270 * 2) / img.width;
        const scaleY = (350 * 2) / img.height;
        const scale = Math.max(scaleX, scaleY); // Use the larger scale to ensure full coverage

        img.set({
          left: CANVAS_WIDTH * 0.27,
          top: CANVAS_HEIGHT * 0.5,
          clipPath: clipPath,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          scaleX: scale,
          scaleY: scale,
        });

        canvas.add(img);
        canvas.renderAll();
      });
    } else {
      // Back side - rectangular portrait with rounded corners
      fabric.Image.fromURL(portraitImage, (img) => {
        // Create a rounded rectangle clip path
        const rectWidth = 900;
        const rectHeight = 550;
        const radius = 50;
        
        const clipPath = new fabric.Rect({
          width: rectWidth,
          height: rectHeight,
          rx: radius,
          ry: radius,
          originX: 'center',
          originY: 'center',
        });

        // Calculate scaling to fill the rectangle
        const scaleX = rectWidth / img.width;
        const scaleY = rectHeight / img.height;
        const scale = Math.max(scaleX, scaleY);

        img.set({
          left: CANVAS_WIDTH * 0.5,
          top: CANVAS_HEIGHT * 0.5,
          clipPath: clipPath,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          scaleX: scale,
          scaleY: scale,
        });

        canvas.add(img);
        
        // Force a proper rescale after adding the image
        const container = canvas.wrapperEl?.parentNode;
        if (container) {
          const containerWidth = container.offsetWidth;
          const canvasScale = containerWidth / CANVAS_WIDTH;
          canvas.setWidth(containerWidth);
          canvas.setHeight(CANVAS_HEIGHT * canvasScale);
          canvas.setZoom(canvasScale);
        }
        
        canvas.renderAll();
      });
    }
  }, [portraitImage, side]);

  return (
    <div className="canvas-container w-full overflow-hidden relative" style={{ minHeight: '200px' }}>
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
}
