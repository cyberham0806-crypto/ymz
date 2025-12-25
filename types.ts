
export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  randomScale: number;
  phase: number;
}

export interface OrnamentData {
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  rotation: [number, number, number];
  weight: number;
  color: string;
}
