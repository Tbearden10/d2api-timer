"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { StarsEffect } from "./effects/StarsEffect";
import { SnowEffect } from "./effects/SnowEffect";
import { FogEffect } from "./effects/FogEffect";
import { Clouds2Effect } from "./effects/Clouds2Effect";
import { CellsEffect } from "./effects/CellsEffect";

interface BackgroundCanvasProps {
  backgroundColor?: string;
  effectsEnabled?: boolean;
  effectType?: "stars" | "snow" | "fog" | "clouds" | "cells";
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
  const effectRef = useRef<THREE.Object3D | null>(null);
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
        if (currentEffectType.current === "stars" && StarsEffect.update) {
          StarsEffect.update(effect as THREE.Points);
        } else if (currentEffectType.current === "snow" && SnowEffect.update) {
          SnowEffect.update(effect as THREE.Points);
        } else if (currentEffectType.current === "fog" && FogEffect.update) {
          FogEffect.update(effect as THREE.Points);
        } else if (currentEffectType.current === "clouds" && Clouds2Effect.update) {
          Clouds2Effect.update(effect as THREE.Points);
        } else if (currentEffectType.current === "cells" && CellsEffect.update) {
          CellsEffect.update(effect as THREE.Points);
        };
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

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    // Remove existing effect
    if (effectRef.current) {
      if (currentEffectType.current === "fog" && FogEffect.destroy) {
        FogEffect.destroy(effectRef.current);
      } else if (currentEffectType.current === "clouds" && Clouds2Effect.destroy) {
        Clouds2Effect.destroy(effectRef.current);
      } else if (currentEffectType.current === "cells" && CellsEffect.destroy) {
        CellsEffect.destroy(effectRef.current);
      }

      scene.remove(effectRef.current);
      effectRef.current = null;
    }

    if (!effectsEnabled) return;

    // Add new effect
    let newEffect: THREE.Object3D | null = null;
    if (effectType === "stars") {
      newEffect = StarsEffect.create();
    } else if (effectType === "snow") {
      newEffect = SnowEffect.create();
    } else if (effectType === "fog") {
      newEffect = FogEffect.create();
    } else if (effectType === "clouds") {
      newEffect = Clouds2Effect.create();
    } else if (effectType === "cells") {
      newEffect = CellsEffect.create();
    } 

    if (newEffect) {
      effectRef.current = newEffect;
      scene.add(newEffect);
    }

    currentEffectType.current = effectType;
  }, [effectsEnabled, effectType]);

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