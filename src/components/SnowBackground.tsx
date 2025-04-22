'use client';

import { useEffect, useRef } from 'react';

export default function CanvasSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const snowflakes: { x: number; y: number; radius: number; speed: number }[] = [];

    // Initialize snowflakes
    function initializeSnowflakes() {
      snowflakes.length = 0; // Clear existing snowflakes
      for (let i = 0; i < 100; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function drawSnow() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        flake.y += flake.speed; // Move snowflake down
        if (flake.y > canvas.height) flake.y = 0; // Reset flake to top when it falls off
        flake.x += Math.random() * 0.5 - 0.25; // Slight horizontal drift
      });
      requestAnimationFrame(drawSnow); // Recursively animate
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeSnowflakes(); // Reinitialize snowflakes on resize
    }

    // Set canvas size and start animation
    resizeCanvas();
    drawSnow();

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas); // Cleanup on unmount
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
}