
import React from 'react';
import { OrbitControls, Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import TreeParticles from './TreeParticles';
import Ornaments from './Ornaments';
import { TreeMorphState } from '../types';
import { COLORS } from '../constants';

interface ExperienceProps {
  state: TreeMorphState;
}

const Experience: React.FC<ExperienceProps> = ({ state }) => {
  return (
    <>
      <color attach="background" args={[COLORS.BACKGROUND]} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        minDistance={10} 
        maxDistance={40}
        autoRotate={state === TreeMorphState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />

      <ambientLight intensity={0.2} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color={COLORS.SOFT_GOLD} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1} color={COLORS.EMERALD} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <group rotation={[0, 0, 0]}>
        <TreeParticles state={state} />
        <Ornaments state={state} />
      </group>

      <Environment preset="night" />

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} // Increased for more selective cinematic glow
          mipmapBlur 
          intensity={2.0} // Boosted intensity for more drama
          radius={0.7} // Wider radius for softer light bleed
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};

export default Experience;
