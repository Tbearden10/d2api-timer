import * as THREE from "three";

// Define a generic effect interface
export interface SceneEffect {
  create: () => THREE.Points;
  update?: (points: THREE.Points) => void;
}
