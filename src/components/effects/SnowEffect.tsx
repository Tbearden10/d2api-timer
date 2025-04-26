import * as THREE from "three";
import { SceneEffect } from "../types/Effect";

// Helper to generate a blurred circular snowflake texture
function createSnowflakeTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const SnowEffect: SceneEffect = {
  create: () => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const velocities: number[] = [];

    const snowflakeCount = 5000; // Number of snowflakes

    for (let i = 0; i < snowflakeCount; i++) {
      positions.push(
        Math.random() * 4000 - 2000, // X position
        Math.random() * 4000 - 2000, // Y position
        Math.random() * 4000 - 2000  // Z position
      );

      // Add velocity for each snowflake
      velocities.push(Math.random() * 1 + 0.5); // Snowflakes fall slowly, range from 0.5 to 1.5
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.Float32BufferAttribute(velocities, 1));

    const material = new THREE.PointsMaterial({
      size: 10, // Size of the snowflakes
      map: createSnowflakeTexture(),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    return new THREE.Points(geometry, material);
  },

  update: (points) => {
    const positions = points.geometry.attributes.position as THREE.BufferAttribute;
    const velocities = points.geometry.attributes.velocity as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const velocityArray = velocities.array as Float32Array;

    const groundLevel = -2000; // The level at which snow accumulates

    for (let i = 0; i < array.length; i += 3) {
      // Snowfall movement: Y position
      array[i + 1] -= velocityArray[i / 3]; // Downward movement

      // Reset snowflake position when it reaches the ground
      if (array[i + 1] < groundLevel) {
        array[i + 1] = 2000; // Reset to the top
        array[i] = Math.random() * 4000 - 2000; // Random X position
        array[i + 2] = Math.random() * 4000 - 2000; // Random Z position
        velocityArray[i / 3] = Math.random() * 1 + 0.5; // Reset falling speed
      }
    }

    positions.needsUpdate = true;
    velocities.needsUpdate = true;
  },
};