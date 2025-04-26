import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { SceneEffect } from "../types/Effect";

export const RainEffect: SceneEffect = {
  create: () => {
    // Create a placeholder Points object for Vanta.js
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ color: 0xffffff });
    const vantaContainer = new THREE.Points(geometry, material);

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
    (vantaContainer as any).vantaEffect = vantaEffect;
    (vantaContainer as any).vantaDiv = vantaDiv;

    return vantaContainer;
  },

  update: () => {
    // Vanta.js handles its own updates, so no action is needed here
  },

  destroy: (object) => {
    // Clean up the Vanta.js effect and remove the temporary div
    if ((object as any).vantaEffect) {
      (object as any).vantaEffect.destroy();
    }
    if ((object as any).vantaDiv) {
      document.body.removeChild((object as any).vantaDiv);
    }
  },
};