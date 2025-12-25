
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Experience from './components/Experience';
import UI from './components/UI';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  const toggleState = () => {
    setState(prev => 
      prev === TreeMorphState.SCATTERED ? TreeMorphState.TREE_SHAPE : TreeMorphState.SCATTERED
    );
  };

  return (
    <div className="w-full h-screen relative bg-[#020805]">
      <Suspense fallback={null}>
        <Canvas
          shadows
          gl={{ 
            antialias: true, 
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
            depth: true
          }}
        >
          <Experience state={state} />
        </Canvas>
      </Suspense>
      
      <UI state={state} onToggle={toggleState} />
      
      <Loader 
        containerStyles={{ background: '#020805' }} 
        innerStyles={{ width: '200px', height: '2px', background: '#043927' }}
        barStyles={{ background: '#D4AF37' }}
        dataStyles={{ color: '#D4AF37', fontFamily: 'Cinzel' }}
      />
    </div>
  );
};

export default App;
