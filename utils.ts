
import { TREE_HEIGHT, TREE_RADIUS, SCATTER_RADIUS } from './constants';

export const generateScatterPos = (): [number, number, number] => {
  const r = SCATTER_RADIUS * Math.pow(Math.random(), 0.5);
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  ];
};

export const generateTreePos = (index: number, total: number): [number, number, number] => {
  // Use a golden ratio spiral or random distribution on a cone
  const y = Math.random() * TREE_HEIGHT;
  const ratio = (TREE_HEIGHT - y) / TREE_HEIGHT;
  const currentRadius = ratio * TREE_RADIUS;
  const theta = Math.random() * Math.PI * 2;
  
  // Add some slight internal volume
  const r = currentRadius * Math.pow(Math.random(), 0.5);

  return [
    r * Math.cos(theta),
    y - TREE_HEIGHT / 2, // Center the tree vertically
    r * Math.sin(theta)
  ];
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
