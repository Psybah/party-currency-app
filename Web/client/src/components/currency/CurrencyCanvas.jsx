import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { fabric } from "fabric";

// Currency dimensions (aspect ratio from the design)
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 800;

const CURRENCY_AMOUNTS = {
  200: "Two Hundred",
  500: "Five Hundred",
  1000: "One Thousand",
};

// Text positions and styles
const TEXT_STYLES = {
  eventId: {
    fontSize: 40, // Increased font size for better legibility
    fontFamily: "Courier New",
    fill: "#D4AF37", // Gold color
    charSpacing: 5,
    lineHeight: 1.2,
  },
};

export const CurrencyCanvas = forwardRef(function CurrencyCanvas(
  {
    templateImage,
    texts = {},
    portraitImage = null,
    side = "front",
    denomination = "200",
    onReady = () => {},
  },
  ref
) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const scaleCanvasRef = useRef(null);
  const [isFabricCanvasObjectReady, setIsFabricCanvasObjectReady] =
    useState(false);

  // Expose download functionality via ref
  useImperativeHandle(ref, () => ({
    downloadImage: (filename) => {
      if (!fabricCanvasRef.current || !isFabricCanvasObjectReady) {
        console.error("Canvas not ready for download");
        return;
      }

      try {
        // Get the original scale before download
        const currentZoom = fabricCanvasRef.current.getZoom();
        const currentWidth = fabricCanvasRef.current.getWidth();
        const currentHeight = fabricCanvasRef.current.getHeight();

        // Temporarily set canvas to full resolution for high-quality download
        fabricCanvasRef.current.setZoom(1);
        fabricCanvasRef.current.setWidth(CANVAS_WIDTH);
        fabricCanvasRef.current.setHeight(CANVAS_HEIGHT);
        fabricCanvasRef.current.renderAll();

        // Generate the image data
        const dataURL = fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 1.0,
          multiplier: 1,
        });

        // Restore the original scale
        fabricCanvasRef.current.setZoom(currentZoom);
        fabricCanvasRef.current.setWidth(currentWidth);
        fabricCanvasRef.current.setHeight(currentHeight);
        fabricCanvasRef.current.renderAll();

        // Create download link
        const link = document.createElement("a");
        link.download =
          filename || `currency-${denomination}-${side}-${Date.now()}.png`;
        link.href = dataURL;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
      } catch (error) {
        console.error("Error downloading currency image:", error);
        return false;
      }
    },

    getImageData: () => {
      if (!fabricCanvasRef.current || !isFabricCanvasObjectReady) {
        return null;
      }

      try {
        const currentZoom = fabricCanvasRef.current.getZoom();
        const currentWidth = fabricCanvasRef.current.getWidth();
        const currentHeight = fabricCanvasRef.current.getHeight();

        fabricCanvasRef.current.setZoom(1);
        fabricCanvasRef.current.setWidth(CANVAS_WIDTH);
        fabricCanvasRef.current.setHeight(CANVAS_HEIGHT);
        fabricCanvasRef.current.renderAll();

        const dataURL = fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 1.0,
          multiplier: 1,
        });

        fabricCanvasRef.current.setZoom(currentZoom);
        fabricCanvasRef.current.setWidth(currentWidth);
        fabricCanvasRef.current.setHeight(currentHeight);
        fabricCanvasRef.current.renderAll();

        return dataURL;
      } catch (error) {
        console.error("Error getting image data:", error);
        return null;
      }
    },

    isReady: () => isFabricCanvasObjectReady,
  }));

  // Text positions and styles
  const textConfig = {
    front: {
      currencyName: {
        x: CANVAS_WIDTH * 0.6,
        y: CANVAS_HEIGHT * 0.3,
        fontSize: 80,
        fontFamily: "Tangerine",
      },
      denominationText: {
        x: CANVAS_WIDTH * 0.6,
        y: CANVAS_HEIGHT * 0.2,
        fontSize: 90,
        fontFamily: "Tangerine",
        fill: "#000000",
      },
      celebration: {
        x: CANVAS_WIDTH * 0.59,
        y: CANVAS_HEIGHT * 0.85,
        fontSize: 70,
        fontFamily: "Playfair Display",
      },
    },
    back: {
      celebration: {
        x: CANVAS_WIDTH * 0.75,
        y: CANVAS_HEIGHT * 0.85,
        fontSize: 48,
        fontFamily: "Playfair Display",
      },
    },
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasEl = canvasRef.current;
    canvasEl.innerHTML = "";
    canvasEl.width = CANVAS_WIDTH;
    canvasEl.height = CANVAS_HEIGHT;

    let initTimeoutId = null;

    initTimeoutId = setTimeout(() => {
      const fabricInstance = new fabric.Canvas(canvasEl, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: "#ffffff",
        selection: false,
        preserveObjectStacking: true,
      });
      fabricCanvasRef.current = fabricInstance;

      scaleCanvasRef.current = () => {
        if (!fabricInstance || !fabricInstance.wrapperEl?.parentNode) return;
        const container = fabricInstance.wrapperEl.parentNode;

        if (container.offsetWidth === 0 && container.clientWidth === 0) {
          return;
        }
        const containerWidth = container.offsetWidth || container.clientWidth;

        const scale = containerWidth / CANVAS_WIDTH;

        fabricInstance.setWidth(containerWidth);
        fabricInstance.setHeight(CANVAS_HEIGHT * scale);
        fabricInstance.setZoom(scale);
        fabricInstance.renderAll();
      };

      if (templateImage) {
        fabric.Image.fromURL(
          templateImage,
          (img) => {
            if (!img) {
              console.error("Failed to load template image:", templateImage);
              if (scaleCanvasRef.current) scaleCanvasRef.current();
              setIsFabricCanvasObjectReady(true);
              return;
            }
            img.scaleToWidth(fabricInstance.width);
            fabricInstance.setBackgroundImage(
              img,
              () => {
                fabricInstance.renderAll();
                if (scaleCanvasRef.current) scaleCanvasRef.current();
                setIsFabricCanvasObjectReady(true);
              },
              { crossOrigin: "anonymous" }
            );
          },
          { crossOrigin: "anonymous" }
        );
      } else {
        if (scaleCanvasRef.current) scaleCanvasRef.current();
        setIsFabricCanvasObjectReady(true);
      }

      window.addEventListener("resize", scaleCanvasRef.current);
    }, 0);

    return () => {
      clearTimeout(initTimeoutId);
      if (scaleCanvasRef.current) {
        window.removeEventListener("resize", scaleCanvasRef.current);
      }
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      setIsFabricCanvasObjectReady(false);
      scaleCanvasRef.current = null;
    };
  }, [templateImage]);

  // Update texts when they change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isFabricCanvasObjectReady) return;

    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      if (obj.type === "text") {
        canvas.remove(obj);
      }
    });

    if (side === "front") {
      const denominationText = new fabric.Text(CURRENCY_AMOUNTS[denomination], {
        left: textConfig.front.denominationText.x,
        top: textConfig.front.denominationText.y,
        fontSize: textConfig.front.denominationText.fontSize,
        fontFamily: textConfig.front.denominationText.fontFamily,
        fill: textConfig.front.denominationText.fill,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      });
      canvas.add(denominationText);
    }

    Object.entries(texts).forEach(([key, value]) => {
      if (!value || !textConfig[side][key]) return;

      const config = textConfig[side][key];
      const text = new fabric.Text(value, {
        left: config.x,
        top: config.y,
        fontSize: config.fontSize,
        fontFamily: config.fontFamily,
        fill: config.fill || "#000000",
        angle: config.angle || 0,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      });
      canvas.add(text);
    });

    if (texts.eventId) {
      const verticalText = texts.eventId.split("").join("\n");
      const eventIdText = new fabric.Text(verticalText, {
        ...TEXT_STYLES.eventId,
        left: CANVAS_WIDTH - 70,
        top: CANVAS_HEIGHT * 0.55,
        originX: "center",
        originY: "center",
        textAlign: "center",
      });
      canvas.add(eventIdText);
    }

    if (Object.keys(texts).length > 0 || side === "front") {
      canvas.renderAll();
    }
  }, [texts, side, denomination, isFabricCanvasObjectReady]);

  // Update portrait image when it changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isFabricCanvasObjectReady) return;

    canvas.getObjects("image").forEach((obj) => {
      canvas.remove(obj);
    });

    if (!portraitImage) {
      canvas.renderAll();
      return;
    }

    if (side === "front") {
      fabric.Image.fromURL(
        portraitImage,
        (img) => {
          if (!img) {
            console.error(
              "Failed to load portrait image for front side:",
              portraitImage
            );
            return;
          }
          const clipPath = new fabric.Ellipse({
            rx: 270,
            ry: 350,
            originX: "center",
            originY: "center",
          });

          const scaleX = (270 * 2) / img.width;
          const scaleY = (350 * 2) / img.height;
          const scale = Math.max(scaleX, scaleY);

          img.set({
            left: CANVAS_WIDTH * 0.27,
            top: CANVAS_HEIGHT * 0.5,
            clipPath: clipPath,
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false,
            scaleX: scale,
            scaleY: scale,
          });

          canvas.add(img);
          canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    } else {
      fabric.Image.fromURL(
        portraitImage,
        (img) => {
          if (!img) {
            console.error(
              "Failed to load portrait image for back side:",
              portraitImage
            );
            return;
          }
          const rectWidth = 900;
          const rectHeight = 550;
          const radius = 50;

          const clipPath = new fabric.Rect({
            width: rectWidth,
            height: rectHeight,
            rx: radius,
            ry: radius,
            originX: "center",
            originY: "center",
          });

          const scaleX = rectWidth / img.width;
          const scaleY = rectHeight / img.height;
          const scale = Math.max(scaleX, scaleY);

          img.set({
            left: CANVAS_WIDTH * 0.5,
            top: CANVAS_HEIGHT * 0.5,
            clipPath: clipPath,
            originX: "center",
            originY: "center",
            selectable: false,
            evented: false,
            scaleX: scale,
            scaleY: scale,
          });

          canvas.add(img);

          const container = canvas.wrapperEl?.parentNode;
          if (container) {
            const containerWidth = container.offsetWidth;
            const canvasScale = containerWidth / CANVAS_WIDTH;
            canvas.setWidth(containerWidth);
            canvas.setHeight(CANVAS_HEIGHT * canvasScale);
            canvas.setZoom(canvasScale);
          }

          canvas.renderAll();
        },
        { crossOrigin: "anonymous" }
      );
    }
  }, [portraitImage, side, isFabricCanvasObjectReady]);

  return (
    <div
      className="canvas-container w-full overflow-hidden relative"
      style={{ minHeight: "200px" }}
    >
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
});
