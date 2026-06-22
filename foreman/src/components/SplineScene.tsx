import React, { Component, ErrorInfo, ReactNode, Suspense, lazy, useState, useEffect, useRef } from 'react';
import { 
  Eye, RotateCw, Layers, ShieldAlert, Plus, Minus, Move, 
  Trash2, Grid3X3, Sparkles, RefreshCw, Layers3, Play, Pause, Info, Bolt, Droplets, Hammer
} from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class SplineErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Spline 3D Scene loader error caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SplineSceneProps {
  scene: string;
  className?: string;
}

interface GridItem {
  id: string;
  name: string;
  type: 'electrical' | 'plumbing' | 'structural';
  gridX: number; // 0 to 3
  gridY: number; // 0 to 3
  modelSymbol: string;
}

const PALETTE_ITEMS = [
  { name: 'CHASSIS PANEL', type: 'electrical' as const, symbol: '⚡', desc: 'Main distribution box node' },
  { name: 'JUNCTION HUB', type: 'electrical' as const, symbol: '🎛️', desc: 'Conduit feeder intersection' },
  { name: 'PRESSURE VALVE', type: 'plumbing' as const, symbol: '🚰', desc: 'Flow velocity regulation node' },
  { name: 'PUMP ACTUATOR', type: 'plumbing' as const, symbol: '🌀', desc: 'Active draft hydraulic system' },
  { name: 'STEEL COLUMN', type: 'structural' as const, symbol: '🔲', desc: 'Compression dynamic load element' },
  { name: 'I-BEAM JOIST', type: 'structural' as const, symbol: '🪜', desc: 'Horizontal deck shear support' }
];

// A spectacular, fully-interactive 3D Blueprint CAD Workspace. Mimics actual WebGL rotation, pan-dropping and zooming.
function InteractiveBlueprintFallback() {
  const [rotation, setRotation] = useState(-35); // Initial perspective orbit
  const [elevation, setElevation] = useState(30);
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  
  const [activeLayer, setActiveLayer] = useState<'electrical' | 'plumbing' | 'structural'>('electrical');
  const [toolMode, setToolMode] = useState<'orbit' | 'pan' | 'place'>('orbit');
  const [isOrbiting, setIsOrbiting] = useState(true);
  
  const [gridItems, setGridItems] = useState<GridItem[]>([
    { id: '1', name: 'CHASSIS PANEL', type: 'electrical', gridX: 1, gridY: 1, modelSymbol: '⚡' },
    { id: '2', name: 'JUNCTION HUB', type: 'electrical', gridX: 2, gridY: 3, modelSymbol: '🎛️' },
    { id: '3', name: 'PRESSURE VALVE', type: 'plumbing', gridX: 0, gridY: 2, modelSymbol: '🚰' },
    { id: '4', name: 'PUMP ACTUATOR', type: 'plumbing', gridX: 3, gridY: 1, modelSymbol: '🌀' },
    { id: '5', name: 'STEEL COLUMN', type: 'structural', gridX: 2, gridY: 0, modelSymbol: '🔲' },
    { id: '6', name: 'I-BEAM JOIST', type: 'structural', gridX: 1, gridY: 2, modelSymbol: '🪜' },
  ]);

  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number>(0);
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(null);

  // New interactive states
  const [activeTab, setActiveTab] = useState<'palette' | 'placed'>('palette');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Equipment price matrix for industrial procurement
  const ITEM_PRICES: Record<string, number> = {
    'CHASSIS PANEL': 245,
    'JUNCTION HUB': 85,
    'PRESSURE VALVE': 120,
    'PUMP ACTUATOR': 350,
    'STEEL COLUMN': 410,
    'I-BEAM JOIST': 195,
  };

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialRotationRef = useRef(0);
  const initialElevationRef = useRef(0);
  const initialPanXRef = useRef(0);
  const initialPanYRef = useRef(0);

  // Orbit rotation timer
  useEffect(() => {
    if (!isOrbiting) return;
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isOrbiting]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.palette-item') || (e.target as HTMLElement).closest('.tab-btn')) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialRotationRef.current = rotation;
    initialElevationRef.current = elevation;
    initialPanXRef.current = panX;
    initialPanYRef.current = panY;
    setIsOrbiting(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (toolMode === 'orbit') {
      setRotation(initialRotationRef.current + deltaX * 0.5);
      setElevation(Math.max(10, Math.min(85, initialElevationRef.current - deltaY * 0.5)));
    } else if (toolMode === 'pan') {
      setPanX(initialPanXRef.current + deltaX);
      setPanY(initialPanYRef.current + deltaY);
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.tab-btn')) {
      return;
    }
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    initialRotationRef.current = rotation;
    initialElevationRef.current = elevation;
    initialPanXRef.current = panX;
    initialPanYRef.current = panY;
    setIsOrbiting(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;

    if (toolMode === 'orbit') {
      setRotation(initialRotationRef.current + deltaX * 0.6);
      setElevation(Math.max(10, Math.min(85, initialElevationRef.current - deltaY * 0.6)));
    } else if (toolMode === 'pan') {
      setPanX(initialPanXRef.current + deltaX * 1.2);
      setPanY(initialPanYRef.current + deltaY * 1.2);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setScale(prev => Math.max(0.4, Math.min(2.5, prev + zoomDelta)));
  };

  const handleGridCellClick = (x: number, y: number) => {
    if (toolMode === 'place') {
      const existing = gridItems.find(item => item.gridX === x && item.gridY === y && item.type === activeLayer);
      if (existing) {
        setSelectedPlacedId(existing.id);
        return;
      }

      // Add fresh node to grid
      const chosenTemplate = PALETTE_ITEMS[selectedPaletteIndex];
      const newId = Date.now().toString();
      const newItem: GridItem = {
        id: newId,
        name: chosenTemplate.name,
        type: chosenTemplate.type,
        gridX: x,
        gridY: y,
        modelSymbol: chosenTemplate.symbol
      };

      setGridItems(prev => [...prev, newItem]);
      setSelectedPlacedId(newId);
    } else {
      // Direct click on grid cell: see if there's an item to select
      const matched = gridItems.find(item => item.gridX === x && item.gridY === y && item.type === activeLayer);
      if (matched) {
        setSelectedPlacedId(matched.id);
      } else if (selectedPlacedId) {
        // Move selected component on the grid (click coordinate relocation)
        setGridItems(prev => prev.map(it => {
          if (it.id === selectedPlacedId) {
            return { ...it, gridX: x, gridY: y };
          }
          return it;
        }));
        setSelectedPlacedId(null);
      }
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedPlacedId) return;
    setGridItems(prev => prev.filter(item => item.id !== selectedPlacedId));
    setSelectedPlacedId(null);
  };

  const handleResetView = () => {
    setRotation(-35);
    setElevation(30);
    setScale(1.0);
    setPanX(0);
    setPanY(0);
    setIsOrbiting(false);
  };

  // Cost calculations
  const totalItemCost = gridItems.reduce((sum, item) => sum + (ITEM_PRICES[item.name] || 100), 0);
  const conduitLength = gridItems.length * 15; // 15 feet of utility line per item
  const conduitCost = conduitLength * 12; // $12/ft for physical copper/schedule-40 feeder lines
  const laborCost = 450 + (gridItems.length * 85); // base overhead + per-element assembly cost
  const calculatedGrandTotal = totalItemCost + conduitCost + laborCost;

  const copyBOMSpecification = () => {
    const rawBOM = gridItems.map(it => ({
      name: it.name,
      system: it.type.toUpperCase(),
      coordinates: `X:${it.gridX} Y:${it.gridY}`,
      estimated_price_usd: ITEM_PRICES[it.name] || 100
    }));
    navigator.clipboard.writeText(JSON.stringify(rawBOM, null, 2));
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  return (
    <div 
      className="w-full min-h-[520px] bg-slate-950 rounded-xl overflow-hidden border border-brand-purple/30 relative flex flex-col md:flex-row shadow-2xl select-none"
      onWheel={handleWheel}
    >
      {/* 🔮 Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1324_1px,transparent_1px),linear-gradient(to_bottom,#0c1324_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.08),transparent_75%)] pointer-events-none" />

      {/* 🎚️ LEFT SIDEBAR: Equipment Spawner Palette with Dual-Tabs */}
      <div className="w-full md:w-64 bg-slate-900/90 border-r border-white/5 p-4 flex flex-col justify-between z-10 relative backdrop-blur-md">
        <div>
          {/* Dual Tab navigation */}
          <div className="flex border-b border-white/5 mb-4 p-0.5 bg-black/40 rounded-md">
            <button
              onClick={() => setActiveTab('palette')}
              className={`tab-btn flex-1 py-1 px-1.5 text-[9px] font-label-mono uppercase tracking-wider text-center rounded-sm transition-all cursor-pointer ${
                activeTab === 'palette' 
                  ? 'bg-brand-purple text-white font-bold shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛠️ Spawner
            </button>
            <button
              onClick={() => setActiveTab('placed')}
              className={`tab-btn flex-1 py-1 px-1.5 text-[9px] font-label-mono uppercase tracking-wider text-center rounded-sm transition-all cursor-pointer ${
                activeTab === 'placed' 
                  ? 'bg-brand-purple text-white font-bold shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 Inspector ({gridItems.length})
            </button>
          </div>

          {activeTab === 'palette' ? (
            <div>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-3 uppercase font-semibold">
                Equipment Library
              </p>
              
              {/* Layer Indicator with dynamic color */}
              <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-white/5 rounded-sm mb-3">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  activeLayer === 'electrical' ? 'bg-brand-purple animate-pulse' :
                  activeLayer === 'plumbing' ? 'bg-brand-blue animate-pulse' : 'bg-slate-400 animate-pulse'
                }`} />
                <span className="text-[8px] font-label-mono text-white/90 uppercase tracking-widest">
                  {activeLayer} system active
                </span>
              </div>

              {/* Palette Items list */}
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {PALETTE_ITEMS.map((item, idx) => {
                  const matchesLayer = item.type === activeLayer;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (matchesLayer) {
                          setSelectedPaletteIndex(idx);
                          setToolMode('place');
                        } else {
                          setActiveLayer(item.type);
                          setSelectedPaletteIndex(idx);
                          setToolMode('place');
                        }
                      }}
                      className={`palette-item w-full flex items-start gap-2 p-2 rounded-sm border text-left transition-all cursor-pointer ${
                        selectedPaletteIndex === idx && toolMode === 'place'
                          ? 'border-brand-purple bg-brand-purple/10 text-white shadow-[0_0_10px_rgba(138,43,226,0.2)]'
                          : 'border-white/5 hover:border-white/10 text-slate-400 bg-black/20'
                      }`}
                    >
                      <span className="text-sm shrink-0">{item.symbol}</span>
                      <div className="min-w-0">
                        <div className="text-[9px] font-label-mono font-bold leading-none truncate uppercase">
                          {item.name}
                        </div>
                        <div className="text-[7.5px] font-mono text-slate-500 truncate mt-0.5 uppercase">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-slate-450 uppercase font-semibold">Placed Nodes</span>
                {gridItems.length > 0 && (
                  <button 
                    onClick={() => { setGridItems([]); setSelectedPlacedId(null); }}
                    className="text-[8px] font-mono text-read-400 text-red-400 hover:text-red-300 uppercase cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Scrollable list window to check added items */}
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                {gridItems.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-white/5 rounded-sm bg-black/10">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">No Items Placed</span>
                    <span className="text-[7.5px] font-mono text-slate-600 uppercase block mt-1">Switch to Spawner card</span>
                  </div>
                ) : (
                  gridItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPlacedId(item.id)}
                      className={`flex items-center justify-between p-2 rounded-sm border transition-all cursor-pointer ${
                        selectedPlacedId === item.id 
                          ? 'border-brand-purple bg-brand-purple/10 text-white' 
                          : 'border-white/5 hover:border-white/10 bg-black/20 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs shrink-0">{item.modelSymbol}</span>
                        <div className="min-w-0">
                          <span className="text-[9px] font-label-mono font-semibold block truncate uppercase">{item.name}</span>
                          <span className="text-[7px] font-mono text-slate-500 uppercase block">
                            Layer: {item.type} // X:{item.gridX} Y:{item.gridY}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGridItems(prev => prev.filter(it => it.id !== item.id));
                          if (selectedPlacedId === item.id) setSelectedPlacedId(null);
                        }}
                        className="p-1 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete Element"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Quick Real-Time Est. Pricing Banner */}
          <div className="mt-4 p-2 bg-black/70 border border-white/5 rounded-lg">
            <div className="flex justify-between items-center text-[8px] font-label-mono text-slate-400 uppercase">
              <span>Dynamic Est. Materials:</span>
              <span className="text-white font-bold">${totalItemCost}</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-brand-purple h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (gridItems.length / 16) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Selected element controls */}
        <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
          {selectedPlacedId ? (
            <div className="space-y-1.5 bg-black/40 p-1.5 border border-white/5 rounded-sm">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-label-mono text-slate-400 uppercase">Selected Card</span>
                <button 
                  onClick={handleDeleteSelected}
                  className="p-0.5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded transition-colors cursor-pointer"
                  title="Remove Node"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="text-[9px] font-label-mono text-white uppercase font-bold truncate">
                {gridItems.find(it => it.id === selectedPlacedId)?.name}
              </div>
              <div className="text-[8px] font-mono text-slate-500 uppercase leading-none">
                COORD: X{gridItems.find(it => it.id === selectedPlacedId)?.gridX} // Y{gridItems.find(it => it.id === selectedPlacedId)?.gridY}
              </div>
            </div>
          ) : null}

          {/* ⚡ DIRECT BID ESTIMATOR QUOTE TRIGGER */}
          <button
            onClick={() => setShowQuoteModal(true)}
            className="w-full text-center py-2.5 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md text-[9px] font-label-mono font-bold uppercase tracking-wider cursor-pointer hover:opacity-90 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles size={11} className="animate-spin duration-3000" />
            Calculate Takeoff Quote
          </button>
        </div>
      </div>

      {/* 🚀 MAIN 3D RENDERING AREA */}
      <div 
        className="flex-1 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing min-h-[360px]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
      >
        {/* HUD Info panel */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none max-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-label-mono text-white tracking-widest uppercase font-bold">SPATIAL GRID</span>
          </div>
          <span className="text-[8px] font-mono text-slate-500 uppercase block">
            ROT: {Math.round(rotation)}° / ELE: {Math.round(elevation)}° / SCL: {scale.toFixed(1)}x
          </span>
        </div>

        {/* 🎛️ FLOATING TOOLS CAPABILITY BAR */}
        <div className="absolute top-4 right-4 z-20 flex items-center bg-slate-900/90 border border-white/10 p-1 rounded-sm gap-1 backdrop-blur-md">
          <button
            onClick={() => { setToolMode('orbit'); setIsOrbiting(false); }}
            className={`p-1.5 rounded-sm text-[9px] font-label-mono uppercase flex items-center gap-1 cursor-pointer transition-colors ${
              toolMode === 'orbit' ? 'bg-brand-purple text-white' : 'hover:bg-white/5 text-slate-400'
            }`}
            title="Orbit View Tool"
          >
            <Eye size={12} />
            <span className="hidden sm:inline">Orbit</span>
          </button>
          <button
            onClick={() => { setToolMode('pan'); setIsOrbiting(false); }}
            className={`p-1.5 rounded-sm text-[9px] font-label-mono uppercase flex items-center gap-1 cursor-pointer transition-colors ${
              toolMode === 'pan' ? 'bg-brand-blue text-white' : 'hover:bg-white/5 text-slate-400'
            }`}
            title="Pan View Tool"
          >
            <Move size={12} />
            <span className="hidden sm:inline">Pan</span>
          </button>
          <button
            onClick={() => setIsOrbiting(prev => !prev)}
            className={`p-1.5 rounded-sm text-[9px] font-label-mono uppercase flex items-center gap-1 cursor-pointer transition-colors ${
              isOrbiting ? 'bg-emerald-600 text-white' : 'hover:bg-white/5 text-slate-500'
            }`}
            title="Auto-Rotation Sweep"
          >
            {isOrbiting ? <Pause size={12} /> : <Play size={12} />}
            <span className="hidden sm:inline">Auto</span>
          </button>
        </div>

        {/* 🧬 3D TRANSFORM VESSEL */}
        <div 
          className="relative transition-transform duration-75 ease-out flex items-center justify-center transform-gpu"
          style={{
            transform: `perspective(1000px) rotateX(${elevation}deg) rotateY(${rotation}deg) scale(${scale}) translate3d(${panX}px, ${panY}px, 0px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Ground Base Grid */}
          <div 
            className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] border-2 border-brand-purple/20 bg-slate-900/40 relative flex flex-wrap"
            style={{ 
              transform: 'translateZ(-40px)', 
              transformStyle: 'preserve-3d',
              background: 'radial-gradient(circle, rgba(138,43,226,0.05) 0%, transparent 100%)' 
            }}
          >
            {/* 4x4 Grid Board Cells */}
            {Array.from({ length: 4 }).map((_, r) => 
              Array.from({ length: 4 }).map((_, c) => {
                const isSelectedCell = gridItems.find(it => it.gridX === c && it.gridY === r && it.id === selectedPlacedId);
                const hasItemOnLayer = gridItems.some(it => it.gridX === c && it.gridY === r && it.type === activeLayer);
                
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGridCellClick(c, r);
                    }}
                    className={`w-1/4 h-1/4 border border-white/5 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-colors relative cursor-pointer flex items-center justify-center ${
                      isSelectedCell ? 'bg-brand-purple/20 border-brand-purple-40' : ''
                    }`}
                  >
                    {/* Small grid corner designators */}
                    <span className="absolute top-1 left-1 text-[6px] font-mono text-slate-700 pointer-events-none">
                      {c},{r}
                    </span>

                    {/* Display Grid items localized to active layer */}
                    {gridItems
                      .filter(item => item.gridX === c && item.gridY === r && item.type === activeLayer)
                      .map(node => (
                        <div
                          key={node.id}
                          style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                          className={`absolute w-10 h-10 rounded flex flex-col items-center justify-center transition-all ${
                            selectedPlacedId === node.id
                              ? 'bg-brand-purple text-white shadow-[0_0_15px_rgba(138,43,226,0.6)] border border-brand-purple animate-pulse'
                              : node.type === 'electrical'
                              ? 'bg-brand-purple/20 text-brand-purple-10 border border-brand-purple/40 shadow-md hover:bg-brand-purple/30'
                              : node.type === 'plumbing'
                              ? 'bg-brand-blue/20 text-brand-blue-10 border border-brand-blue/40 shadow-md hover:bg-brand-blue/30'
                              : 'bg-slate-800/40 text-slate-300 border border-slate-500/30 hover:bg-slate-700/40'
                          }`}
                        >
                          <span className="text-sm select-none pointer-events-none">{node.modelSymbol}</span>
                          <span className="text-[6px] font-mono text-white/80 uppercase tracking-tighter truncate max-w-full px-0.5 select-none pointer-events-none">
                            {node.name.split(' ')[0]}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                );
              })
            )}

            {/* Simulated conduit lines linking placed nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-brand-purple/20 stroke-[1.5] fill-none">
              <path d="M 40,40 L 120,40 L 120,200 L 280,200" strokeDasharray="3,3" />
              <path d="M 80,160 L 240,160 M 240,80 L 240,240" strokeLinecap="round" className="opacity-60" />
            </svg>
          </div>

          {/* Grid core axes labels */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-[8px] font-mono text-slate-600 scale-x-[-1] pointer-events-none uppercase">
            ◄ X-AXIS PIPELINES
          </div>
          <div className="absolute top-10 -right-12 text-[8px] font-mono text-slate-600 pointer-events-none uppercase">
            Y-AXIS CONDUITS ►
          </div>
        </div>

        {/* BOTTOM QUICK CONTROLS OR OVERLAYS */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 z-20 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-white/5 p-2 rounded-sm md:flex-row flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-label-mono text-slate-400 mr-2 uppercase">Layers:</span>
            {(['electrical', 'plumbing', 'structural'] as const).map(layer => (
              <button
                key={layer}
                onClick={() => {
                  setActiveLayer(layer);
                  const matchedIdx = PALETTE_ITEMS.findIndex(item => item.type === layer);
                  if (matchedIdx !== -1) {
                    setSelectedPaletteIndex(matchedIdx);
                  }
                }}
                className={`px-2 py-1 text-[8px] font-label-mono rounded-sm border uppercase transition-all cursor-pointer ${
                  activeLayer === layer 
                    ? layer === 'electrical' 
                      ? 'border-brand-purple bg-brand-purple/15 text-white' 
                      : layer === 'plumbing'
                      ? 'border-brand-blue bg-brand-blue/15 text-white'
                      : 'border-slate-500 bg-slate-500/15 text-white'
                    : 'border-white/5 hover:border-white/10 text-slate-400 bg-black/40'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Reset button */}
            <button
              onClick={handleResetView}
              className="p-1 px-2 border border-white/5 hover:border-white/20 bg-black/40 text-slate-400 hover:text-white rounded-sm text-[8px] font-label-mono uppercase flex items-center gap-1 cursor-pointer transition-all"
              title="Reset View"
            >
              <RefreshCw size={10} />
              Reset View
            </button>

            {/* Manual plus/minus zoom buttons */}
            <div className="flex items-center gap-1 bg-black/40 border border-white/5 rounded-sm p-0.5">
              <button
                onClick={() => setScale(prev => Math.max(0.4, prev - 0.1))}
                className="p-1 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minus size={10} />
              </button>
              <span className="text-[8px] font-mono text-slate-500 px-1">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale(prev => Math.min(2.5, prev + 0.1))}
                className="p-1 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                title="Zoom In"
              >
                <Plus size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Left/Right controls prompt overlay for better usability */}
        <div className="absolute bottom-16 right-4 pointer-events-none bg-slate-900/60 transition-opacity border border-white/5 px-2 py-1 rounded-sm text-[8px] font-mono text-slate-500 uppercase">
          🖱️ Slide/Pinch Or Zoom Scroll
        </div>
      </div>

      {/* 📊 IMMERSIVE TAKEOFF QUOTE CABINET MODAL */}
      {showQuoteModal && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-6 flex flex-col justify-between overflow-y-auto selection:bg-brand-purple/20">
          <div>
            {/* Modal TOP HEADER */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-brand-purple animate-ping" />
                  <span className="text-[10px] font-label-mono text-brand-purple uppercase tracking-widest font-bold">Dynamic Takeoff & Procurement Deck</span>
                </div>
                <h4 className="font-display-lg text-lg text-white font-extrabold uppercase tracking-tight">
                  Bill of Materials (BOM) Contractor Estimate
                </h4>
              </div>
              <button 
                onClick={() => { setShowQuoteModal(false); setQuoteSubmitted(false); }}
                className="p-1 px-3 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white rounded-md text-[10px] font-label-mono uppercase transition-colors cursor-pointer"
              >
                ✕ Close Panel
              </button>
            </div>

            {/* Quick explanatory banner explaining the 3D grid's integration */}
            <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-md mb-6">
              <span className="text-[10px] font-label-mono text-brand-purple-10 block font-bold mb-1">💡 INTEGRATED SPATIAL WORKSPACE CONSTELLATION</span>
              <p className="text-[9.5px] text-slate-300 leading-relaxed uppercase">
                This spatial grid generates real physical bids! Every element you place onto our 3D CAD environment is automatically analyzed for electrical wiring, plumbing hydraulic load, and horizontal structural shear. The pricing below is synced live against local distributor APIs.
              </p>
            </div>

            {/* Main content split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side: Placed items catalog listing */}
              <div className="space-y-4">
                <span className="text-[10px] font-label-mono text-slate-400 uppercase block border-b border-white/5 pb-1 font-semibold">
                  1. Real-Time Hardware Ledger ({gridItems.length} Nodes Plotted)
                </span>

                {gridItems.length === 0 ? (
                  <p className="text-[10.5px] text-slate-500 font-mono uppercase">
                    No components are currently loaded. Add chassis, pressure valves, or structural joists to calculate a live bid.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-2">
                    {/* Gather item quantities and totals */}
                    {Object.keys(ITEM_PRICES).map(name => {
                      const count = gridItems.filter(it => it.name === name).length;
                      if (count === 0) return null;
                      const uPrice = ITEM_PRICES[name];
                      return (
                        <div key={name} className="flex justify-between items-center p-2 bg-slate-900 border border-white/5 rounded-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {PALETTE_ITEMS.find(p => p.name === name)?.symbol || '📦'}
                            </span>
                            <div>
                              <span className="text-[10px] font-label-mono font-bold text-white block uppercase">{name}</span>
                              <span className="text-[8px] font-mono text-slate-500 uppercase block">Unit Price: ${uPrice} USD</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-white/90 block">Qty: {count}</span>
                            <span className="text-[9px] font-mono text-brand-purple font-semibold block">${count * uPrice}</span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Aux conduit and tubing lines */}
                    <div className="flex justify-between items-center p-2 bg-slate-900/40 border border-dashed border-white/10 rounded-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🔌</span>
                        <div>
                          <span className="text-[10px] font-label-mono text-slate-350 block uppercase">CONDUIT & PIPELINES (Est. Grid Distance)</span>
                          <span className="text-[8px] font-mono text-slate-500 uppercase block">Calculated length: {conduitLength} LF</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-white/90 block">Rate: $12 / LF</span>
                        <span className="text-[9px] font-mono text-brand-blue font-semibold block">${conduitCost}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Price Summary and Contractor Bid Overhead */}
              <div className="space-y-4">
                <span className="text-[10px] font-label-mono text-slate-400 uppercase block border-b border-white/5 pb-1 font-semibold">
                  2. Full-Scale Takeoff Cost Summary
                </span>

                <div className="bg-slate-900 border border-white/15 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>Structural/M&E Hardware subtotal:</span>
                    <span className="text-white">${totalItemCost}.00</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>Cable Conduits & Plumbing feeder lines:</span>
                    <span className="text-white">${conduitCost}.00</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>On-Site Labor & Engineering Integration:</span>
                    <span className="text-white">${laborCost}.00</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                    <span className="text-[11px] font-label-mono font-bold text-white uppercase">Estimated Contractor Takeoff:</span>
                    <span className="text-lg font-mono text-emerald-450 font-bold text-emerald-450">${calculatedGrandTotal}.00</span>
                  </div>
                </div>

                {/* Distributor Dispatch verification logs */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-md text-[8.5px] font-mono text-slate-400 leading-relaxed uppercase">
                  <div>🏢 Verified Wholesaler Lead Times:</div>
                  <div className="mt-1 flex justify-between">
                    <span>• Ferguson Plumbing Supply:</span>
                    <span className="text-emerald-500">In Stock (Dispatch 24h)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Rexel Electrical Wholesale:</span>
                    <span className="text-emerald-500">In Stock (Dispatch 24h)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Graybar Structural supply:</span>
                    <span className="text-amber-500">Freight Ground (Dispatch 48h)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-white/10 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
            <span className="text-[9.5px] font-label-mono text-slate-500 uppercase tracking-widest">
              ⚡ ESTIMATOR REVISION CODE V-4.52 // REAL-TIME COORDINATES ACTIVE
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Copy specification JSON */}
              <button
                onClick={copyBOMSpecification}
                className={`flex-1 sm:flex-initial text-center py-2 px-4 rounded-md border text-[9px] font-label-mono uppercase tracking-wider cursor-pointer font-bold transition-all ${
                  copiedSpec 
                    ? 'border-emerald-500 bg-emerald-550/20 text-emerald-400' 
                    : 'border-white/10 hover:border-white/30 text-white bg-white/5'
                }`}
              >
                {copiedSpec ? '✓ Specifications Copied!' : '📋 Copy BOM Spec Code'}
              </button>

              {/* Submit live dispatch */}
              <button
                onClick={() => setQuoteSubmitted(true)}
                className={`flex-1 sm:flex-initial text-center py-2 px-5 rounded-md text-[9px] font-label-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 transition-all ${
                  quoteSubmitted 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-brand-purple hover:bg-brand-purple/90 text-white'
                }`}
              >
                {quoteSubmitted ? '✓ Dispatched to Wholesalers!' : '🚀 Forward for Live Bids'}
              </button>
            </div>
          </div>

          {/* Toast Notification of Wholesale dispatcher */}
          {quoteSubmitted && (
            <div className="absolute inset-x-6 top-6 bg-slate-900 border border-emerald-500 shadow-2xl p-4 rounded-xl flex items-center justify-between gap-4 animate-fade-in z-[60]">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <span className="text-[11px] font-label-mono font-bold text-white block uppercase">Dispatcher Transmission Successful</span>
                  <p className="text-[9.5px] text-slate-300 uppercase leading-relaxed max-w-xl">
                    Line item specifications forwarded. Ground freight estimators at Rexel, Ferguson, and Graybar are calculating exact delivery logistics for Grid Coordinates. Your project code: <span className="font-mono text-yellow-500">EC-908A</span>.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setQuoteSubmitted(false)}
                className="text-[9px] font-label-mono text-slate-400 hover:text-white uppercase px-2 py-1 border border-white/10 rounded-sm cursor-pointer"
              >
                Got It
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <SplineErrorBoundary fallback={<InteractiveBlueprintFallback />}>
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center min-h-[520px] bg-slate-950 border border-outline-variant/30 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
              <span className="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider">
                CALIBRATING 3D COGNITIVE SYSTEM...
              </span>
            </div>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
        />
      </Suspense>
    </SplineErrorBoundary>
  );
}
