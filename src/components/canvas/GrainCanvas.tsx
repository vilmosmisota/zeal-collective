import { useEffect, useRef } from "react";
import { useWindowDimensions } from "../../utils/hooks";

export default function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const grainRef = useRef<HTMLCanvasElement | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  useEffect(() => {
    const canvas = canvasRef.current;
    const grainCanvas = grainRef.current;
    const patternSize = 150;
    const patternScaleX = 1;
    const patternScaleY = 1;
    const patternRefreshInterval = 3; // 8
    const patternAlpha = 15;
    const patternPixelDataLength = patternSize * patternSize * 4; // rgba = 4
    let frame = 0;
    let animationFrameId: number;

    if (!canvas) return;
    canvas.width = windowWidth;
    canvas.height = windowHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(patternScaleX, patternScaleY);

    if (!grainCanvas) return;
    grainCanvas.width = patternSize;
    grainCanvas.height = patternSize;
    const grainCtx = grainCanvas.getContext("2d");
    if (!grainCtx) return;
    const grainData = grainCtx.createImageData(patternSize, patternSize);

    const update = () => {
      let value;

      for (let i = 0; i < patternPixelDataLength; i += 4) {
        value = (Math.random() * 255) | 0;

        grainData.data[i] = value;
        grainData.data[i + 1] = value;
        grainData.data[i + 2] = value;
        grainData.data[i + 3] = patternAlpha;
      }

      grainCtx.putImageData(grainData, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, windowWidth, windowHeight);

      const pattern = ctx.createPattern(grainCanvas, "repeat");
      if (!pattern) return;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, windowWidth, windowHeight);
    };

    function loop() {
      if (++frame % patternRefreshInterval === 0) {
        update();
        draw();
      }

      animationFrameId = window.requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [windowWidth, windowHeight]);
  return (
    <canvas className="absolute w-full h-full top-0 left-0 z-0" ref={canvasRef}>
      <canvas ref={grainRef} />
    </canvas>
  );
}
