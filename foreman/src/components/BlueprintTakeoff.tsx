import React, { useState, useRef } from 'react';
import { Plus, Download, Trash2, ShieldAlert, Layers, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { TakeoffMarker } from '../types';

interface BlueprintTakeoffProps {
  markers: TakeoffMarker[];
  onAddMarker: (marker: TakeoffMarker) => void;
  onClearMarkers: () => void;
  onDeleteMarker: (id: string) => void;
  selectedTrade: 'electrical' | 'plumbing' | 'hvac';
  setSelectedTrade: (trade: 'electrical' | 'plumbing' | 'hvac') => void;
}

export default function BlueprintTakeoff({
  markers,
  onAddMarker,
  onClearMarkers,
  onDeleteMarker,
  selectedTrade,
  setSelectedTrade
}: BlueprintTakeoffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<string>('junction_box');
  const [zoom, setZoom] = useState<number>(100);
  const [customFile, setCustomFile] = useState<string | null>(null);

  // Suggested trade items to drop
  const tradeTools = {
    electrical: [
      { id: 'junction_box', label: 'Junction Box', price: 3.25, color: '#4085EC' },
      { id: 'breaker', label: 'breaker 20A', price: 8.99, color: '#4F3A96' },
      { id: 'cable_run', label: '12/2 Copper Run (10ft)', price: 45.99, color: '#ffd6fa' },
    ],
    plumbing: [
      { id: 'pipe', label: '2" PVC Pipe x 10ft', price: 12.50, color: '#FFA9FE' },
      { id: 'valve', label: 'Brass Shutoff Valve', price: 24.95, color: '#faba73' },
      { id: 'junction_box', label: 'Drain Trap', price: 18.50, color: '#4085EC' },
    ],
    hvac: [
      { id: 'vent', label: 'Floor Air Vent', price: 14.20, color: '#ccbdff' },
      { id: 'conduit', label: 'Flexible Ducting x 25ft', price: 38.00, color: '#ffddbb' },
      { id: 'breaker', label: 'Thermostat Control Switch', price: 89.00, color: '#4F3A96' },
    ]
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const currentTool = tradeTools[selectedTrade].find(t => t.id === activeTool) 
      || tradeTools[selectedTrade][0];

    const newMarker: TakeoffMarker = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      type: currentTool.id as any,
      label: currentTool.label,
      price: currentTool.price
    };

    onAddMarker(newMarker);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCustomFile(url);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-lg border border-outline-variant/60" id="takeoff-sandbox">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="font-label-mono text-[10px] text-brand-blue uppercase tracking-widest block mb-1">
            CAD/Field Blueprint Suite
          </span>
          <h3 className="font-headline-lg text-2xl text-white">Blueprint Takeoff Board</h3>
        </div>
        
        {/* Trade Switcher */}
        <div className="flex bg-surface-variant p-1 rounded-sm border border-outline-variant">
          {(['electrical', 'plumbing', 'hvac'] as const).map(trade => (
            <button
              key={trade}
              onClick={() => {
                setSelectedTrade(trade);
                setActiveTool(tradeTools[trade][0].id);
              }}
              className={`px-4 py-1.5 font-label-mono text-xs rounded-sm uppercase transition-colors ${
                selectedTrade === trade
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-on-surface-variant mb-6">
        Simulate real-world blueprint takeoffs. Click to select an active inventory part below, then tap anywhere on the blueprint template to add components to your invoice list.
      </p>

      {/* Toolbox list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {tradeTools[selectedTrade].map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`p-3 rounded-sm border text-left flex items-center justify-between transition-all ${
              activeTool === tool.id
                ? 'border-brand-blue bg-brand-blue/10 text-white'
                : 'border-outline-variant bg-surface-dim hover:bg-surface-variant/50 text-on-surface-variant'
            }`}
          >
            <div>
              <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tool.color }} />
                {tool.label}
              </div>
              <span className="font-label-mono text-xs text-on-surface-variant mt-1 block">
                ${tool.price.toFixed(2)} unit
              </span>
            </div>
            {activeTool === tool.id && <span className="font-label-mono text-[10px] bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-sm">ACTIVE</span>}
          </button>
        ))}
      </div>

      {/* Blueprint Canvas Container */}
      <div className="relative border border-outline-variant rounded-sm overflow-hidden bg-zinc-950 aspect-[16/10] sm:aspect-[16/9]">
        {/* Grid Overlay lines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(64, 133, 236, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(64, 133, 236, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: `${35 * (zoom / 100)}px ${35 * (zoom / 100)}px`
          }}
        />

        {/* CAD Blueprint Blueprint Image */}
        {customFile ? (
          <img 
            src={customFile} 
            alt="Custom blueprint" 
            className="w-full h-full object-cover opacity-75"
            style={{ transform: `scale(${zoom / 100})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40 select-none">
            {/* Draw a simulated floor plan */}
            <svg 
              className="w-full h-full pointer-events-none" 
              viewBox="0 0 800 450" 
              fill="none" 
              stroke="#4085EC" 
              strokeWidth="2"
              strokeOpacity="0.45"
            >
              {/* Outer boundary */}
              <rect x="50" y="40" width="700" height="370" strokeDasharray="5,5" />
              {/* Rooms */}
              <line x1="280" y1="40" x2="280" y2="410" />
              <line x1="520" y1="40" x2="520" y2="410" />
              <line x1="50" y1="210" x2="280" y2="210" />
              <line x1="520" y1="260" x2="750" y2="260" />
              {/* Doors door arcs */}
              <path d="M 280,180 A 30,30 0 0,0 250,210" strokeDasharray="3,3" />
              <path d="M 520,230 A 30,30 0 0,1 550,260" strokeDasharray="3,3" />
              <path d="M 400,40 A 40,40 0 0,0 360,80" strokeDasharray="3,3" />
              {/* Blueprint details */}
              <text x="70" y="80" fill="#4085EC" fontSize="12" fontFamily="monospace" opacity="0.8">GARAGE / MECHANICAL</text>
              <text x="330" y="80" fill="#4085EC" fontSize="12" fontFamily="monospace" opacity="0.8">CREW HUB / WORKSPACE</text>
              <text x="560" y="80" fill="#4085EC" fontSize="12" fontFamily="monospace" opacity="0.8">COMMERCIAL SUITE</text>
              <text x="70" y="380" fill="#4085EC" fontSize="10" fontFamily="monospace" opacity="0.5">SCALE: 1/4" = 1'-0"</text>
              <text x="330" y="380" fill="#4085EC" fontSize="10" fontFamily="monospace" opacity="0.5">FOREMAN ASSISTANT ENG V2.9</text>
            </svg>
          </div>
        )}

        {/* Visual Drawing Workspace Canvas Area */}
        <div 
          ref={containerRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 cursor-crosshair z-10"
        />

        {/* Placed Markers */}
        {markers.map(m => {
          const matchedTool = tradeTools[selectedTrade].find(t => t.id === m.type) || { color: '#4085EC' };
          return (
            <div
              key={m.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteMarker(m.id);
                }}
                className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg relative transition-all duration-300 hover:scale-125"
                style={{ backgroundColor: matchedTool.color }}
                title={`Delete ${m.label}`}
              >
                <span className="absolute hidden group-hover:block whitespace-nowrap bg-background text-white text-[10px] font-mono px-2 py-1 rounded-sm border border-outline-variant -top-8 left-1/2 -translate-x-1/2 shadow-xl z-50">
                  {m.label} (${m.price.toFixed(2)}) • Click to Remove
                </span>
                <span className="ping absolute top-0 left-0 w-full h-full opacity-35" style={{ backgroundColor: matchedTool.color }} />
              </button>
            </div>
          );
        })}

        {/* Control bar */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-background/80 backdrop-blur-md p-1.5 rounded-sm border border-outline-variant">
          <button 
            onClick={() => setZoom(Math.max(50, zoom - 20))}
            className="p-1 text-on-surface-variant hover:text-white transition-colors" 
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="font-label-mono text-[10px] text-white px-1">{zoom}%</span>
          <button 
            onClick={() => setZoom(Math.min(200, zoom + 20))}
            className="p-1 text-on-surface-variant hover:text-white transition-colors" 
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Blueprint watermark */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-outline-variant text-[10px] font-label-mono text-brand-blue">
          <Layers size={12} fill="currentColor" className="opacity-75" />
          <span>ACTIVE: {selectedTrade.toUpperCase()} INTERFACE</span>
        </div>
      </div>

      {/* Blueprint Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-outline-variant/40">
        <div className="flex items-center gap-2">
          <label className="bg-surface-variant border border-outline-variant hover:bg-surface-bright text-white font-label-mono text-xs px-4 py-2 cursor-pointer rounded-sm uppercase tracking-wider flex items-center gap-2 transition-colors">
            <Maximize size={12} />
            Upload Custom Job PDF / Photo
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
          {customFile && (
            <button 
              onClick={() => {
                setCustomFile(null);
                setZoom(100);
              }}
              className="text-xs text-red-400 hover:text-white transition-colors font-label-mono uppercase"
            >
              Reset to Preset
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {markers.length > 0 && (
            <button
              onClick={onClearMarkers}
              className="bg-transparent border border-red-500/30 hover:border-red-500 text-red-400 font-label-mono text-xs px-4 py-2 rounded-sm uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={12} />
              Clear CAD Points ({markers.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
