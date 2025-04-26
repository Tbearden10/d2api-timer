import * as THREE from "three";
import { SceneEffect } from "../types/Effect";

/**
 * Generates a blurred circular sprite texture for use with PointsMaterial.
 */
function generateSpriteTexture(size: number = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const center = size / 2;
  const gradient = ctx.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    center
  );

  // White at center, fading to transparent edge
  gradient.addColorStop(0.0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1.0, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Stars effect implementation with blurred sprites
export const StarsEffect: SceneEffect = {
  create: () => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    // Create random stars
    for (let i = 0; i < 10000; i++) {
      positions.push(
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000
      );
      const color = new THREE.Color(
        `hsl(${Math.random() * 360}, 70%, 50%)`
      );
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // Generate a blurred sprite for each point
    const sprite = generateSpriteTexture(64);

    const material = new THREE.PointsMaterial({
      size: 5,
      map: sprite,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.01,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      opacity: 0.8,
    });

    return new THREE.Points(geometry, material);
  },

  update: (points) => {
    // Slow rotation for star field
    points.rotation.y += 0.001;
  },
};