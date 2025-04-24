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
    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }

    // Create a dark background for space effect
    scene.background = new THREE.Color(0x000000); // Black background

    // Create a particle system (stars)
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
    });

    const starCount = 1000;
    const positions = [];
    for (let i = 0; i < starCount; i++) {
      positions.push(
        Math.random() * 2000 - 1000, // X position
        Math.random() * 2000 - 1000, // Y position
        Math.random() * 2000 - 1000 // Z position
      );
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create shooting stars
    const shootingStars: THREE.Mesh[] = [];
    const shootingStarGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const shootingStarMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 }); // Gold color

    for (let i = 0; i < 5; i++) {
      const shootingStar = new THREE.Mesh(shootingStarGeometry, shootingStarMaterial);
      shootingStar.position.set(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
      );
      scene.add(shootingStar);
      shootingStars.push(shootingStar);
    }

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animate the scene
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate stars
      stars.rotation.x += 0.0005;
      stars.rotation.y += 0.0005;

      // Move shooting stars
      shootingStars.forEach((star) => {
        star.position.x -= 10;
        star.position.y -= 5;

        // Reset position if out of bounds
        if (star.position.x < -1000 || star.position.y < -1000) {
          star.position.set(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
          );
        }
      });

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

  return <div ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", zIndex: -1 }} />;
};

export default BackgroundCanvas;