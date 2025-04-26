import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { SceneEffect } from "../types/Effect";

interface VantaContainer extends THREE.Object3D {
  vantaEffect?: { destroy: () => void };
  vantaDiv?: HTMLDivElement;
}

export const FogEffect: SceneEffect = {
  create: () => {
    // Create a placeholder Points object for Vanta.js
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ color: 0xffffff });
    const vantaContainer: VantaContainer = new THREE.Points(geometry, material);

    // Vanta.js requires a DOM element, so we create a temporary div
    const vantaDiv = document.createElement("div");
    vantaDiv.style.position = "absolute";
    vantaDiv.style.top = "0";
    vantaDiv.style.left = "0";
    vantaDiv.style.width = "100%";
    vantaDiv.style.height = "100%";
    vantaDiv.style.zIndex = "-1";
    document.body.appendChild(vantaDiv);

    // Initialize Vanta.js effect
    const vantaEffect = FOG({
      el: vantaDiv,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      highlightColor: 0xff0000,
      midtoneColor: 0x0000ff,
      lowlightColor: 0x00ff00,
      baseColor: 0x000000,
    });

    // Attach the Vanta.js instance to the placeholder object for cleanup
    vantaContainer.vantaEffect = vantaEffect;
    vantaContainer.vantaDiv = vantaDiv;

    return vantaContainer as THREE.Points;
  },

  update: () => {
    // Vanta.js handles its own updates, so no action is needed here
  },

  destroy: (object: THREE.Object3D) => {
    // Ensure the object is valid and contains the Vanta.js properties
    const vantaContainer = object as VantaContainer;

    if (vantaContainer.vantaEffect) {
      try {
        // Destroy the Vanta.js effect
        vantaContainer.vantaEffect.destroy();
      } catch (error) {
        console.error("Error destroying Vanta.js effect:", error);
      }
    }

    // Remove the temporary div if it exists
    if (vantaContainer.vantaDiv) {
      try {
        document.body.removeChild(vantaContainer.vantaDiv);
      } catch (error) {
        console.error("Error removing Vanta.js div:", error);
      }
    }
  },
};