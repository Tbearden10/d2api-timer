import * as THREE from "three";
import { SceneEffect } from "../types/Effect";

// Stars effect implementation
export const StarsEffect: SceneEffect = {
  create: () => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    // Create random stars
    for (let i = 0; i < 3000; i++) {
      positions.push(
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000
      );
      const color = new THREE.Color(`hsl(${Math.random() * 360}, 70%, 50%)`);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geometry, material);
  },

  update: (points) => {
    points.rotation.y += 0.001; // Slow rotation for star field
  },
};
