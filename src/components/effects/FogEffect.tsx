import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { SceneEffect } from "../types/Effect";

interface VantaContainer extends THREE.Object3D {
  vantaEffect?: { destroy: () => void };
  vantaDiv?: HTMLDivElement;
}

// Utility function to generate a random color
function getRandomColor(): number {
  return Math.floor(Math.random() * 0xffffff);
}

// Utility to get a random number in [min, max], rounded to two decimals
function getRandomInRange(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export const FogEffect: SceneEffect = {
  create: () => {
    // Create a placeholder Points object for Vanta.js
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ color: 0xffffff });
    const vantaContainer: VantaContainer = new THREE.Points(geometry, material);

    // Vanta.js requires a DOM element
    const vantaDiv = document.createElement("div");
    vantaDiv.style.position = "absolute";
    vantaDiv.style.top = "0";
    vantaDiv.style.left = "0";
    vantaDiv.style.width = "100%";
    vantaDiv.style.height = "100%";
    vantaDiv.style.zIndex = "-1";
    document.body.appendChild(vantaDiv);

    // Randomize every aspect
    const highlightColor = getRandomColor();
    const midtoneColor   = getRandomColor();
    const lowlightColor  = getRandomColor();
    const baseColor      = getRandomColor();

    // Based on your example defaults, you could narrow these ranges
    // e.g. blurFactor around 0.65, zoom around 2, speed around 3.9
    const blurFactor = getRandomInRange(0.3, 1.0);
    const zoom       = getRandomInRange(1.0, 3.0);
    const speed      = getRandomInRange(0.5, 5.0);

    // Initialize Vanta.js effect with randomized settings
    const vantaEffect = FOG({
      el: vantaDiv,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      highlightColor,
      midtoneColor,
      lowlightColor,
      baseColor,
      blurFactor,
      zoom,
      speed,
    });

    // Attach for cleanup
    vantaContainer.vantaEffect = vantaEffect;
    vantaContainer.vantaDiv = vantaDiv;

    return vantaContainer as THREE.Points;
  },

  update: () => {
    // No per‑frame updates needed; Vanta handles its own animation loop
  },

  destroy: (object: THREE.Object3D) => {
    const vantaContainer = object as VantaContainer;

    if (vantaContainer.vantaEffect) {
      try {
        vantaContainer.vantaEffect.destroy();
      } catch (error) {
        console.error("Error destroying Vanta.js effect:", error);
      }
    }

    if (vantaContainer.vantaDiv) {
      try {
        document.body.removeChild(vantaContainer.vantaDiv);
      } catch (error) {
        console.error("Error removing Vanta.js div:", error);
      }
    }
  },
};