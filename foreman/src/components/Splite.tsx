import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Construction, FileText, ArrowLeftRight } from 'lucide-react';

export default function Splite() {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-label-mono text-[10px] text-brand-purple uppercase tracking-widest flex items-center gap-1.5 bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-sm">
          <Sparkles size={12} className="animate-pulse text-brand-purple" />
          Interactive Splite Compare
        </span>
        <span className="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider">
          Drag Slider To Deep Dive
        </span>
      </div>

      <div 
        ref={containerRef}
        className="w-full h-[320px] rounded-lg border border-outline-variant relative overflow-hidden select-none cursor-ew-resize bg-surface-variant shadow-2xl"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Left Side: Before (Original physical blue sheet / hand sketch) */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 border-r border-dotted border-white/20">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          {/* Simulated sketchy drawing */}
          <div className="absolute inset-0 flex flex-col justify-center p-8 opacity-60">
            <div className="border border-white/20 w-4/5 h-3/5 mx-auto rounded-sm relative p-4 flex flex-col justify-between border-dashed">
              <div className="border-b border-white/10 pb-2 flex justify-between">
                <span className="text-[9px] font-mono text-white/40">DWG-04 FIELD SKETCH</span>
                <span className="text-[9px] font-mono text-white/40">SCALE: NONE</span>
              </div>
              
              {/* Blueprints elements */}
              <div className="space-y-4 my-auto relative">
                <div className="w-12 h-12 rounded-full border border-white/20 border-dashed absolute top-2 left-6 flex items-center justify-center">
                  <span className="text-[8px] font-mono text-white/30">MTR</span>
                </div>
                <div className="w-20 h-8 border border-white/20 border-dashed absolute bottom-4 right-10 flex items-center justify-center">
                  <span className="text-[8px] font-mono text-white/30">PANEL-A</span>
                </div>
                {/* Connecting hand-drawn style paths */}
                <svg className="w-full h-24 absolute top-0 left-0 text-white/20">
                  <path d="M 40,40 L 90,80 L 150,20 L 220,60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
                </svg>
              </div>

              <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest text-left mt-16 leading-relaxed">
                ✏️ Handwritten notes: "Confirm J-Boxes counts on G-2 level as they lay out."
              </div>
            </div>
          </div>

          {/* Left badge */}
          <div className="absolute top-4 left-4 bg-background/80 border border-outline-variant/60 rounded-sm px-3 py-1 text-[9px] font-label-mono text-on-surface-variant uppercase">
            Original Hand Layout
          </div>
        </div>

        {/* Right Side: After (Digitalized Foreman AI Takeoff CAD) */}
        <div 
          className="absolute inset-y-0 right-0 left-0 bg-[#070b13] overflow-hidden"
          style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
        >
          {/* Glowing matrix layer */}
          <div className="absolute inset-0 bg-[radial-gradient(#4085ec15_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          
          {/* Animated radar scanning sweep */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-brand-blue/10 to-transparent pointer-events-none animate-[pulse_3s_infinite]" />

          {/* Plotted CAD drawing */}
          <div className="absolute inset-0 flex flex-col justify-center p-8">
            <div className="border border-brand-blue/40 w-4/5 h-3/5 mx-auto rounded-sm relative p-4 flex flex-col justify-between bg-brand-blue/5 glow-primary">
              <div className="border-b border-brand-blue/20 pb-2 flex justify-between">
                <span className="text-[9px] font-label-mono text-brand-blue">CAD-G-2 PLOTTED DIGITALIZED</span>
                <span className="text-[9px] font-label-mono text-emerald-400">STATUS: RECONCILED</span>
              </div>

              {/* Glowing elements */}
              <div className="space-y-4 my-auto relative">
                {/* Meter with glow */}
                <div className="w-12 h-12 rounded-full border border-brand-blue bg-brand-blue/10 absolute top-2 left-6 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(64,133,236,0.2)]">
                  <span className="text-[8px] font-label-mono text-brand-blue font-bold">MTR-01</span>
                </div>
                {/* Panel with glow */}
                <div className="w-20 h-8 border border-emerald-500 bg-emerald-500/10 absolute bottom-4 right-10 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="text-[8px] font-label-mono text-emerald-400 font-bold">PANEL-A (LINKED)</span>
                </div>
                {/* Circuit paths */}
                <svg className="w-full h-24 absolute top-0 left-0 text-brand-blue/50">
                  <path d="M 40,40 L 90,80 L 150,20 L 220,60" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  {/* Glowing pulses */}
                  <circle cx="90" cy="80" r="4" fill="#4085ec" className="animate-ping" />
                  <circle cx="150" cy="20" r="4" fill="#10b981" />
                </svg>
              </div>

              <div className="text-[10px] font-label-mono text-brand-blue uppercase tracking-widest text-left mt-16 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span>Extracted outlet arrays: 14 nodes localized.</span>
              </div>
            </div>
          </div>

          {/* Right badge */}
          <div className="absolute top-4 right-4 bg-brand-purple/90 border border-brand-purple text-white rounded-sm px-3 py-1 text-[9px] font-label-mono uppercase tracking-wider glow-primary">
            Foreman AI Grid Takeoff
          </div>
        </div>

        {/* Vertical Slipping Handle Line */}
        <div 
          className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-brand-blue via-brand-purple to-brand-blue pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Glowing central node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border-2 border-brand-purple shadow-xl flex items-center justify-center z-20 pointer-events-none">
            <ArrowLeftRight size={14} className="text-brand-purple" />
          </div>
        </div>
      </div>
    </div>
  );
}
