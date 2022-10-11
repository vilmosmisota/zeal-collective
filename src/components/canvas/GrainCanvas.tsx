import { useEffect, useRef } from "react";

export default function GrainCanvas() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  // useEffect(() => {
  //   if (!canvasRef.current) return;

  //   // change these settings
  //   const patternSize = 64;
  //   const patternScaleX = 3;
  //   const patternScaleY = 1;
  //   const patternRefreshInterval = 4;
  //   const patternAlpha = 25;
  //   const patternPixelDataLength = patternSize * patternSize * 4;
  //   let patternCanvas;
  //   let patternCtx;
  //   let patternData;
  //   const frame = 0;

  //   const canvas = canvasRef.current;
  //   const viewWidth = canvasRef.current.width;
  //   const viewHeight = canvasRef.current.height;
  //   const context = canvas.getContext("2d");

  //   let animationFrameId: number;
  //   //Our first draw

  //   if (!context) return;
  //   // context.fillStyle = "#000000";
  //   // context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  //   function initGrain() {
  //     patternCanvas = document.createElement("canvas");
  //     patternCanvas.width = patternSize;
  //     patternCanvas.height = patternSize;
  //     patternCtx = patternCanvas.getContext("2d");
  //     patternData = patternCtx.createImageData(patternSize, patternSize);
  //   }

  //   function update() {
  //     let value;

  //     for (let i = 0; i < patternPixelDataLength; i += 4) {
  //       value = (Math.random() * 255) | 0;

  //       patternData.data[i] = value;
  //       patternData.data[i + 1] = value;
  //       patternData.data[i + 2] = value;
  //       patternData.data[i + 3] = patternAlpha;
  //     }

  //     patternCtx.putImageData(patternData, 0, 0);
  //   }

  //   // function initCanvas() {
  //   //     viewWidth = context.width = context.clientWidth;
  //   //     viewHeight = context.height = context.clientHeight;
  //   //     ctx = context.getContext('2d');

  //   //     ctx.scale(patternScaleX, patternScaleY);
  //   // }

  //   // create a canvas which will be used as a pattern
  //   function initGrain() {
  //     patternCanvas = document.createElement("canvas");
  //     patternCanvas.width = patternSize;
  //     patternCanvas.height = patternSize;
  //     patternCtx = patternCanvas.getContext("2d");
  //     patternData = patternCtx.createImageData(patternSize, patternSize);
  //   }

  //   // put a random shade of gray into every pixel of the pattern
  //   function update() {
  //     var value;

  //     for (var i = 0; i < patternPixelDataLength; i += 4) {
  //       value = (Math.random() * 255) | 0;

  //       patternData.data[i] = value;
  //       patternData.data[i + 1] = value;
  //       patternData.data[i + 2] = value;
  //       patternData.data[i + 3] = patternAlpha;
  //     }

  //     patternCtx.putImageData(patternData, 0, 0);
  //   }

  //   // fill the canvas using the pattern
  //   function draw() {
  //     ctx.clearRect(0, 0, viewWidth, viewHeight);

  //     ctx.fillStyle = ctx.createPattern(patternCanvas, "repeat");
  //     ctx.fillRect(0, 0, viewWidth, viewHeight);
  //   }

  //   function loop() {
  //     if (++frame % patternRefreshInterval === 0) {
  //       update();
  //       draw();
  //     }

  //     requestAnimationFrame(loop);
  //   }

  //   const render = () => {
  //     initCanvas();
  //     initGrain();
  //     requestAnimationFrame(loop);
  //   };
  //   render();

  //   return () => {
  //     window.cancelAnimationFrame(animationFrameId);
  //   };
  // }, []);

  return <canvas ref={canvasRef} />;
}
