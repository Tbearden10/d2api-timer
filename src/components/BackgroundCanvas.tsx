"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Ensure proper scaling on high-DPI screens
    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }

    // Expanded dark color palette with gradients
    const darkColors = [
      "#0d1b2a", "#1b263b", "#0f3d3e", "#1a1a1d", 
      "#2c2c54", "#3a0ca3", "#4a0d67", "#2d6a4f", 
      "#3b3b58", "#222831", "#393e46", "#1e2022", 
      "#2b2d42", "#4a4e69", "#374151"
    ];

    // Randomly select a gradient of two colors
    const color1 = new THREE.Color(darkColors[Math.floor(Math.random() * darkColors.length)]);
    const color2 = new THREE.Color(darkColors[Math.floor(Math.random() * darkColors.length)]);
    scene.background = color1.clone().lerp(color2, 0.3);

    // Particle system setup (stars)
    const particleGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending, // Glowing effect
    });

    const positions: number[] = [];
    const colors: number[] = [];

    const generateStars = () => {
      const particleCount = 2500; // Increased number of particles
      for (let i = 0; i < particleCount; i++) {
        // Random positions for stars
        positions.push(
          Math.random() * 4000 - 2000, // X position
          Math.random() * 4000 - 2000, // Y position
          Math.random() * 4000 - 2000 // Z position
        );
        // Randomized star colors (white with a subtle tint)
        const starColor = new THREE.Color().setHSL(Math.random(), 0.6, 0.9);
        colors.push(starColor.r, starColor.g, starColor.b);
      }
    };

    const generateComets = () => {
      const geometry = new THREE.BufferGeometry();
      const cometCount = 15;
      const cometPositions = [];
      const cometColors = [];

      for (let i = 0; i < cometCount; i++) {
        cometPositions.push(
          Math.random() * 4000 - 2000,
          Math.random() * 4000 - 2000,
          Math.random() * 4000 - 2000
        );
        const cometColor = new THREE.Color(1, 0.8, Math.random() * 0.5 + 0.5);
        cometColors.push(cometColor.r, cometColor.g, cometColor.b);
      }

      geometry.setAttribute("position", new THREE.Float32BufferAttribute(cometPositions, 3));
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(cometColors, 3));

      const cometMaterial = new THREE.PointsMaterial({
        size: 10,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending, // Glowing effect
      });

      const comets = new THREE.Points(geometry, cometMaterial);
      scene.add(comets);

      return { geometry, points: comets };
    };

    generateStars();

    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const stars = new THREE.Points(particleGeometry, starMaterial);
    scene.add(stars);

    const { geometry: cometGeo } = generateComets();

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animate the particles
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the star system
      stars.rotation.x += 0.0004;
      stars.rotation.y += 0.0004;

      // Animate comets
      const cometPos = cometGeo.attributes.position.array;
      for (let i = 0; i < cometPos.length; i += 3) {
        cometPos[i] += 6; // X
        cometPos[i + 1] += 2; // Y
        if (cometPos[i] > 2000 || cometPos[i + 1] > 2000) {
          cometPos[i] = -2000 + Math.random() * 100;
          cometPos[i + 1] = -2000 + Math.random() * 100;
        }
      }
      cometGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      while (scene.children.length > 0) {
        const child = scene.children[0];
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
        scene.remove(child);
      }
    };
  }, []);

  return <div ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: -1 }} />;
};

export default BackgroundCanvas;