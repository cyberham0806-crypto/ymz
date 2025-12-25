
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BALL_COUNT, BOX_COUNT, STAR_COUNT, LIGHT_STRIP_COUNT, COLORS, TREE_HEIGHT, TREE_RADIUS } from '../constants';
import { generateScatterPos, generateTreePos } from '../utils';
import { TreeMorphState } from '../types';

interface OrnamentsProps {
  state: TreeMorphState;
}

const Ornaments: React.FC<OrnamentsProps> = ({ state }) => {
  const ballsRef = useRef<THREE.InstancedMesh>(null);
  const boxesRef = useRef<THREE.InstancedMesh>(null);
  const starsRef = useRef<THREE.InstancedMesh>(null);
  const lightsRef = useRef<THREE.InstancedMesh>(null);
  
  const morphProgress = useRef(0);

  const ballData = useMemo(() => {
    return Array.from({ length: BALL_COUNT }).map((_, i) => ({
      sPos: new THREE.Vector3(...generateScatterPos()),
      tPos: new THREE.Vector3(...generateTreePos(i, BALL_COUNT)),
      color: i % 2 === 0 ? COLORS.GOLD : COLORS.SOFT_GOLD,
      scale: 0.15 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  const boxData = useMemo(() => {
    const palette = ['#ff0000', '#ffd700', '#a020f0', '#00ff00', '#ff8c00', '#ff1493'];
    return Array.from({ length: BOX_COUNT }).map((_, i) => {
      const tpArr = generateTreePos(i, BOX_COUNT);
      const treeY = tpArr[1]; // Height ranges from -6 to 6 (centered around 0)
      
      // Calculate scale based on height: larger at the bottom (treeY ~ -6), smaller at top (treeY ~ 6)
      // Normalize treeY to 0-1 range (0 at bottom, 1 at top)
      const normalizedHeight = (treeY + TREE_HEIGHT / 2) / TREE_HEIGHT;
      const heightScale = THREE.MathUtils.lerp(1.2, 0.4, normalizedHeight);
      
      return {
        sPos: new THREE.Vector3(...generateScatterPos()),
        tPos: new THREE.Vector3(...tpArr),
        color: palette[i % palette.length],
        scale: (0.4 + Math.random() * 0.3) * heightScale,
        phase: Math.random() * Math.PI * 2
      };
    });
  }, []);

  const starData = useMemo(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => ({
      sPos: new THREE.Vector3(...generateScatterPos()),
      tPos: new THREE.Vector3(...generateTreePos(i, STAR_COUNT)),
      color: COLORS.SOFT_GOLD,
      scale: 0.05 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  // Spiral light strip data
  const lightStripData = useMemo(() => {
    const turns = 8;
    return Array.from({ length: LIGHT_STRIP_COUNT }).map((_, i) => {
      const t = i / LIGHT_STRIP_COUNT;
      const angle = t * Math.PI * 2 * turns;
      const radiusAtHeight = (1 - t) * TREE_RADIUS * 1.05; // Slightly outside the foliage
      const treeY = t * TREE_HEIGHT - TREE_HEIGHT / 2;
      
      const tp = new THREE.Vector3(
        radiusAtHeight * Math.cos(angle),
        treeY,
        radiusAtHeight * Math.sin(angle)
      );

      return {
        sPos: new THREE.Vector3(...generateScatterPos()),
        tPos: tp,
        scale: 0.06 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? COLORS.SOFT_GOLD : '#ffffff'
      };
    });
  }, []);

  useEffect(() => {
    if (boxesRef.current) {
      const color = new THREE.Color();
      boxData.forEach((data, i) => {
        color.set(data.color);
        boxesRef.current!.setColorAt(i, color);
      });
      boxesRef.current.instanceColor!.needsUpdate = true;
    }
    if (lightsRef.current) {
      const color = new THREE.Color();
      lightStripData.forEach((data, i) => {
        color.set(data.color);
        lightsRef.current!.setColorAt(i, color);
      });
      lightsRef.current.instanceColor!.needsUpdate = true;
    }
  }, [boxData, lightStripData]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((stateFrame) => {
    const time = stateFrame.clock.getElapsedTime();
    const target = state === TreeMorphState.TREE_SHAPE ? 1 : 0;
    morphProgress.current = THREE.MathUtils.lerp(morphProgress.current, target, 0.03);

    // Update Balls
    if (ballsRef.current) {
      ballData.forEach((data, i) => {
        const pos = new THREE.Vector3().lerpVectors(data.sPos, data.tPos, morphProgress.current);
        const floatY = Math.sin(time + data.phase) * 0.1;
        dummy.position.set(pos.x, pos.y + floatY, pos.z);
        dummy.scale.setScalar(data.scale);
        dummy.rotation.set(time * 0.2 + data.phase, time * 0.1, 0);
        dummy.updateMatrix();
        ballsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      ballsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Boxes (Gifts)
    if (boxesRef.current) {
      boxData.forEach((data, i) => {
        const pos = new THREE.Vector3().lerpVectors(data.sPos, data.tPos, morphProgress.current);
        const floatY = Math.cos(time * 0.8 + data.phase) * 0.15;
        dummy.position.set(pos.x, pos.y + floatY, pos.z);
        dummy.scale.setScalar(data.scale);
        dummy.rotation.set(data.phase * 0.5, time * 0.3 + data.phase, data.phase * 0.2);
        dummy.updateMatrix();
        boxesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      boxesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Stars
    if (starsRef.current) {
      starData.forEach((data, i) => {
        const pos = new THREE.Vector3().lerpVectors(data.sPos, data.tPos, morphProgress.current);
        const twinkle = 0.5 + 0.5 * Math.sin(time * 3 + data.phase);
        dummy.position.set(pos.x, pos.y, pos.z);
        dummy.scale.setScalar(data.scale * (0.8 + twinkle * 0.4));
        dummy.updateMatrix();
        starsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      starsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Light Strip
    if (lightsRef.current) {
      lightStripData.forEach((data, i) => {
        const pos = new THREE.Vector3().lerpVectors(data.sPos, data.tPos, morphProgress.current);
        // Sequential flashing effect
        const flash = Math.sin(time * 5 - i * 0.05) * 0.5 + 0.5;
        dummy.position.set(pos.x, pos.y, pos.z);
        dummy.scale.setScalar(data.scale * (0.5 + flash * 1.5));
        dummy.updateMatrix();
        lightsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      lightsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={ballsRef} args={[undefined, undefined, BALL_COUNT]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} color={COLORS.GOLD} />
      </instancedMesh>

      <instancedMesh ref={boxesRef} args={[undefined, undefined, BOX_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.2} roughness={0.4} />
      </instancedMesh>

      <instancedMesh ref={starsRef} args={[undefined, undefined, STAR_COUNT]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial emissive={COLORS.SOFT_GOLD} emissiveIntensity={2} color={COLORS.SOFT_GOLD} />
      </instancedMesh>

      {/* Spiral Flashing Lights */}
      <instancedMesh ref={lightsRef} args={[undefined, undefined, LIGHT_STRIP_COUNT]}>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshStandardMaterial emissiveIntensity={5} toneMapped={false} />
      </instancedMesh>
    </>
  );
};

export default Ornaments;
