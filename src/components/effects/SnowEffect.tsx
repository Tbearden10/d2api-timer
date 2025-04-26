import * as THREE from "three";
import { SceneEffect } from "../types/Effect";

// Snow effect implementation
export const SnowEffect: SceneEffect = {
  create: () => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    // Create random snowflakes
    for (let i = 0; i < 1000; i++) {
      positions.push(
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000
      );
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    return new THREE.Points(geometry, material);
  },

  update: (points) => {
    const positions = points.geometry.attributes.position as THREE.BufferAttribute;
    const array = positions.array as Float32Array;

    // Simulate snow falling and wind drift
    for (let i = 0; i < array.length; i += 3) {
      array[i + 1] -= 1.0; // Snowfall
      array[i] += Math.sin(array[i + 1] * 0.01) * 0.2; // Wind drift

      // Reset snowflake position when it goes too low
      if (array[i + 1] < -2000) {
        array[i + 1] = 2000;
        array[i] = Math.random() * 4000 - 2000;
        array[i + 2] = Math.random() * 4000 - 2000;
      }
    }

    positions.needsUpdate = true; // Apply changes
  },
};
