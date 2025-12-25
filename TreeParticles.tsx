
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARTICLE_COUNT, COLORS } from '../constants';
import { generateScatterPos, generateTreePos } from '../utils';
import { TreeMorphState } from '../types';

interface TreeParticlesProps {
  state: TreeMorphState;
}

const TreeParticles: React.FC<TreeParticlesProps> = ({ state }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [scatterPositions, treePositions, sizes, phases] = useMemo(() => {
    const sPos = new Float32Array(PARTICLE_COUNT * 3);
    const tPos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const ph = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const sp = generateScatterPos();
      const tp = generateTreePos(i, PARTICLE_COUNT);
      
      sPos.set(sp, i * 3);
      tPos.set(tp, i * 3);
      sz[i] = Math.random() * 0.15 + 0.05;
      ph[i] = Math.random() * Math.PI * 2;
    }

    return [sPos, tPos, sz, ph];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorphProgress: { value: 0 },
    uColorEmerald: { value: new THREE.Color(COLORS.DEEP_GREEN) },
    uColorGold: { value: new THREE.Color(COLORS.GOLD) },
  }), []);

  useFrame((stateFrame) => {
    const time = stateFrame.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      
      // Smooth morphing logic
      const target = state === TreeMorphState.TREE_SHAPE ? 1 : 0;
      materialRef.current.uniforms.uMorphProgress.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMorphProgress.value,
        target,
        0.05
      );
    }
  });

  const vertexShader = `
    uniform float uTime;
    uniform float uMorphProgress;
    attribute vec3 scatterPos;
    attribute vec3 treePos;
    attribute float phase;
    attribute float size;
    varying float vDistance;
    varying float vPhase;

    void main() {
      vPhase = phase;
      vec3 pos = mix(scatterPos, treePos, uMorphProgress);
      
      // Floating animation
      float offset = sin(uTime + phase) * 0.1;
      pos.y += offset;
      pos.x += cos(uTime * 0.5 + phase) * 0.05;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = size * (300.0 / -mvPosition.z);
      vDistance = length(pos);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorEmerald;
    uniform vec3 uColorGold;
    uniform float uTime;
    varying float vPhase;

    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;

      // Sparkling effect
      float sparkle = sin(uTime * 2.0 + vPhase) * 0.5 + 0.5;
      vec3 color = mix(uColorEmerald, uColorGold, sparkle * 0.4);
      
      // Glow edge
      float strength = 1.0 - (dist * 2.0);
      strength = pow(strength, 1.5);

      gl_FragColor = vec4(color, strength);
    }
  `;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scatterPos"
          count={PARTICLE_COUNT}
          array={scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-treePos"
          count={PARTICLE_COUNT}
          array={treePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-phase"
          count={PARTICLE_COUNT}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default TreeParticles;
