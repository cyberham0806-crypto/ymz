
import React from 'react';
import { TreeMorphState } from '../types';

interface UIProps {
  state: TreeMorphState;
  onToggle: () => void;
}

const UI: React.FC<UIProps> = ({ state, onToggle }) => {
  const isTree = state === TreeMorphState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 text-white">
      {/* Top Header */}
      <div className={`transition-all duration-1000 flex flex-col items-center text-center ${isTree ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-4xl md:text-7xl font-bold tracking-widest text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          MERRY CHRISTMAS
        </h1>
        <p className="font-chinese mt-6 text-xl md:text-3xl font-light text-emerald-100/80 tracking-widest">
          愿易明珠新的一年里事事顺遂
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onToggle}
          className="pointer-events-auto px-10 py-3 rounded-full border border-[#D4AF37] bg-[#043927]/30 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 font-bold tracking-widest text-lg uppercase"
        >
          {isTree ? '散落星空' : '凝聚圣诞'}
        </button>
        
        <div className="text-xs text-[#D4AF37]/50 tracking-[0.2em] uppercase">
          Interactive Christmas Experience • Emerald & Gold
        </div>
      </div>
    </div>
  );
};

export default UI;
