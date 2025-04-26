"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { StarsEffect } from "./effects/StarsEffect";
import { SnowEffect } from "./effects/SnowEffect";
import { RainEffect } from "./effects/RainEffect";

interface BackgroundCanvasProps {
  backgroundColor?: string;
  effectsEnabled?: boolean;
  effectType?: "stars" | "snow" | "rain" | "fireflies" | "aurora" | "galaxy" | "wavegrid";
}

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  backgroundColor = "#000000",
  effectsEnabled = true,
  effectType = "stars",
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const effectRef = useRef<THREE.Points | null>(null);
  const currentEffectType = useRef(effectType);
  const backgroundColorRef = useRef<string>(backgroundColor);

  // Initial setup: scene, camera, renderer
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const scene = sceneRef.current;
      const effect = effectRef.current;

      if (!scene || !renderer || !cameraRef.current) return;

      // Update background only when color actually changes
      if (
        (scene.background as THREE.Color)?.getHexString() !==
        new THREE.Color(backgroundColorRef.current).getHexString()
      ) {
        scene.background = new THREE.Color(backgroundColorRef.current);
      }

      // Update the effect
      if (effect) {
        if (currentEffectType.current === "stars") {
          if (StarsEffect.update) {
            StarsEffect.update(effect);
          }
        } else if (currentEffectType.current === "snow") {
          if (SnowEffect.update) {
            SnowEffect.update(effect);
          }
        } else if (currentEffectType.current === "rain") {
          if (RainEffect.update) {
            RainEffect.update(effect);
          }
        }
      }

      renderer.render(scene, cameraRef.current);
    };

    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        const camera = cameraRef.current;
        const renderer = rendererRef.current;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // Track backgroundColor with ref (for animation loop throttling)
  useEffect(() => {
    backgroundColorRef.current = backgroundColor;
  }, [backgroundColor]);

  // Update effects (stars/snow/rain toggle)
  useEffect(() => {
    const scene = sceneRef.current;
    currentEffectType.current = effectType;

    if (!scene) return;

    // Remove existing effect
    if (effectRef.current) {
      scene.remove(effectRef.current);
      effectRef.current.geometry.dispose();
      if (Array.isArray(effectRef.current.material)) {
        effectRef.current.material.forEach((mat) => mat.dispose());
      } else {
        effectRef.current.material.dispose();
      }
      effectRef.current = null;
    }

    if (!effectsEnabled) return;

    // Add new effect
    let newEffect: THREE.Points | null = null;
    if (effectType === "stars") {
      newEffect = StarsEffect.create();
    } else if (effectType === "snow") {
      newEffect = SnowEffect.create();
    } else if (effectType === "rain") {
      newEffect = RainEffect.create();
    }

    if (newEffect) {
      effectRef.current = newEffect;
      scene.add(newEffect);
    }
  }, [effectsEnabled, effectType]); // Ensure dependencies are correct

  return (
    <div
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
};

export default BackgroundCanvas;