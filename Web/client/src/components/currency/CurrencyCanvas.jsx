import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

// Currency dimensions (aspect ratio from the design)
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 800;

export function CurrencyCanvas({ 
  templateImage,
  texts = {},
  portraitImage = null,
  side = 'front',
  onReady = () => {},
}) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  // Text positions and styles
  const textConfig = {
    front: {
      celebration: {
        x: CANVAS_WIDTH * 0.65,
        y: CANVAS_HEIGHT * 0.65,
        fontSize: 48,
        fontFamily: 'Playfair Display',
      },
      currencyName: {
        x: CANVAS_WIDTH * 0.65,
        y: CANVAS_HEIGHT * 0.35,
        fontSize: 36,
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
        x: CANVAS_WIDTH * 0.65,
        y: CANVAS_HEIGHT * 0.5,
        fontSize: 48,
        fontFamily: 'Playfair Display',
      },
    },
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      selection: false, // Disable group selection
      preserveObjectStacking: true,
    });

    // Disable all interactions
    canvas.forEachObject(obj => {
      obj.selectable = false;
      obj.evented = false;
    });

    fabricCanvasRef.current = canvas;

    // Load template image
    fabric.Image.fromURL(templateImage, (img) => {
      img.scaleToWidth(canvas.width);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

      // Create oval clip path for portrait
      if (side === 'front') {
        const clipPath = new fabric.Ellipse({
          left: CANVAS_WIDTH * 0.2,
          top: CANVAS_HEIGHT * 0.5,
          rx: 200,
          ry: 240,
          originX: 'center',
          originY: 'center',
          fill: 'transparent',
          stroke: '#D4AF37',
          strokeWidth: 2,
          selectable: false,
          evented: false,
        });
        canvas.add(clipPath);
      }

      // Scale canvas to fit container
      const scaleCanvas = () => {
        const container = canvas.wrapperEl.parentNode;
        if (!container) return;

        const containerWidth = container.offsetWidth;
        const scale = containerWidth / CANVAS_WIDTH;

        canvas.setWidth(containerWidth);
        canvas.setHeight(CANVAS_HEIGHT * scale);
        canvas.setZoom(scale);
        canvas.renderAll();
      };

      scaleCanvas();
      window.addEventListener('resize', scaleCanvas);

      onReady(canvas);
    });

    // Cleanup
    return () => {
      canvas.dispose();
      window.removeEventListener('resize', scaleCanvas);
    };
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

    // Add new texts
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
  }, [texts, side]);

  // Update portrait image when it changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !portraitImage || side !== 'front') return;

    // Remove existing portrait
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.type === 'image') {
        canvas.remove(obj);
      }
    });

    // Add new portrait
    fabric.Image.fromURL(portraitImage, (img) => {
      const clipPath = new fabric.Ellipse({
        rx: 200,
        ry: 240,
        originX: 'center',
        originY: 'center',
      });

      img.set({
        left: CANVAS_WIDTH * 0.2,
        top: CANVAS_HEIGHT * 0.5,
        clipPath: clipPath,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });

      img.scaleToWidth(400);
      canvas.add(img);
      canvas.renderAll();
    });
  }, [portraitImage, side]);

  return (
    <div className="canvas-container w-full overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
}
