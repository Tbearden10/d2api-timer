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

    // Define a pool of deep, dark colors
    const darkColors = [
      "#0d1b2a", // Deep navy blue
      "#1b263b", // Dark blue
      "#0f3d3e", // Dark teal green
      "#1a1a1d", // Almost black
      "#2c2c54", // Deep indigo
      "#3a0ca3", // Dark purple
      "#4a0d67", // Deep pink-purple
      "#2d6a4f", // Dark green
      "#3b3b58", // Dark gray-blue
    ];

    // Randomly select a background color from the pool
    const selectedColor = darkColors[Math.floor(Math.random() * darkColors.length)];
    scene.background = new THREE.Color(selectedColor);

    // Particle system setup
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true, // Enable per-particle colors
    });

    const positions = [];
    const colors = [];

    // Generate particles for stars
    const generateParticles = () => {
      const particleCount = 1500; // Number of particles
      for (let i = 0; i < particleCount; i++) {
        // Random positions for stars
        positions.push(
          Math.random() * 2000 - 1000, // X position
          Math.random() * 2000 - 1000, // Y position
          Math.random() * 2000 - 1000 // Z position
        );
        // White stars
        const color = new THREE.Color(0xffffff);
        colors.push(color.r, color.g, color.b);
      }
    };

    const generateComets = () => {
      const geometry = new THREE.BufferGeometry();
      const cometCount = 10;
      const cometPositions = [];
      const cometColors = [];

      for (let i = 0; i < cometCount; i++) {
        cometPositions.push(
          Math.random() * 4000 - 2000,
          Math.random() * 4000 - 2000,
          Math.random() * 4000 - 2000
        );
        const color = new THREE.Color(1, 1, Math.random());
        cometColors.push(color.r, color.g, color.b);
      }

      geometry.setAttribute("position", new THREE.Float32BufferAttribute(cometPositions, 3));
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(cometColors, 3));

      const material = new THREE.PointsMaterial({ size: 10, vertexColors: true, transparent: true, opacity: 0.8 });
      const comets = new THREE.Points(geometry, material);
      scene.add(comets);

      return { geometry, points: comets };
    };

    const { geometry: cometGeo, points: cometPoints } = generateComets();

    generateParticles();

    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

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

      // Rotate the particle system for stars
      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.0005;

      // Animate comets
      const cometPos = cometGeo.attributes.position.array;
      for (let i = 0; i < cometPos.length; i += 3) {
        cometPos[i] += 5; // X
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
      window.removeEventListener("resize", handleResize); // Remove resize listener
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