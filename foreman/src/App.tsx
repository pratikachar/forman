import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Menu, 
  X,
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Zap, 
  Check, 
  ShieldCheck, 
  FolderPlus, 
  Layers, 
  Cpu, 
  HelpCircle,
  Construction,
  Award,
  Truck,
  DollarSign,
  ChevronUp,
  Linkedin,
  Youtube,
  Facebook,
  Instagram
} from 'lucide-react';

import { TakeoffMarker, EstimatorItem } from './types';
import BlueprintTakeoff from './components/BlueprintTakeoff';
import EstimatorPanel from './components/EstimatorPanel';
import ProcurementHUD from './components/ProcurementHUD';
import ContactForm from './components/ContactForm';
import Splite from './components/Splite';
import { IMAGES } from './assets/images';
import { Logo } from './components/Logo';
import LegalPage from './components/LegalPage';
import { SplineScene } from './components/SplineScene';

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'terms' | 'privacy' | 'policy'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<'electrical' | 'plumbing' | 'hvac'>('electrical');
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [selectedPkg, setSelectedPkg] = useState<string>('crew');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Monitor scroll for Back-To-Top float
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Unified global takeoff & manual invoice list states
  const [markers, setMarkers] = useState<TakeoffMarker[]>([
    { id: '1', x: 25, y: 35, type: 'junction_box', label: 'UL Metallic J-Box', price: 3.25 },
    { id: '2', x: 45, y: 40, type: 'breaker', label: 'Square D 20A Breaker', price: 8.99 },
    { id: '3', x: 38, y: 72, type: 'cable_run', label: '12/2 Copper Run (10ft)', price: 45.99 },
  ]);

  const [manualItems, setManualItems] = useState<EstimatorItem[]>([
    { id: 'm1', name: 'Master Foreman Layout Labor', category: 'electrical', quantity: 1, unitPrice: 120.00, unit: 'Svc' }
  ]);

  const handleAddMarker = (newMarker: TakeoffMarker) => {
    setMarkers(prev => [...prev, newMarker]);
  };

  const handleClearMarkers = () => {
    setMarkers([]);
  };

  const handleDeleteMarker = (id: string) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const handleAddManualItem = (newItem: EstimatorItem) => {
    setManualItems(prev => [...prev, newItem]);
  };

  const handleRemoveManualItem = (id: string) => {
    setManualItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearManualItems = () => {
    setManualItems([]);
  };

  if (activePage !== 'home') {
    return <LegalPage pageType={activePage} onBack={() => setActivePage('home')} />;
  }

  return (
    <div className="bg-background text-on-background font-body-md text-slate-200 overflow-x-hidden antialiased flex flex-col min-h-screen relative">
      <div className="grain-overlay" />

      {/* Top Navigation Bar */}
      <nav className="backdrop-blur-xl w-full top-0 sticky z-50 transition-all duration-300 nav-glow bg-background/80 border-b border-outline-variant/30" id="mainNav">
        <div className="flex justify-between items-center w-full px-6 sm:px-margin-page max-w-7xl mx-auto py-4">
          
          {/* Brand/Logo */}
          <a className="flex items-center gap-2.5 group transition-transform duration-300 hover:scale-[1.02]" href="#" onClick={() => setActivePage('home')}>
            <Logo variant="light" height={28} />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a className="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#estimator">
              CAD Estimator
            </a>
            <a className="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#procurement">
              Sourcing Radar
            </a>
            <a className="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#features">
              Features
            </a>
            <a className="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#pricing">
              Pricing
            </a>
            <a className="text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider hover:text-brand-blue transition-colors" href="#">
              Blog
            </a>
          </div>

          {/* Actions & Hamburger Toggle */}
          <div className="flex items-center gap-4">
            <a 
              className="hidden sm:inline-flex bg-brand-purple text-white font-label-mono text-[10px] uppercase font-bold px-5 py-2 rounded-sm tracking-wider hover:bg-brand-blue transition-all duration-300 glow-primary" 
              href="#pricing"
            >
              Start Free Trial
            </a>

            <button 
              className="md:hidden text-on-surface-variant hover:text-brand-blue p-1.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Slider */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 border-b border-outline-variant p-6 space-y-4 absolute top-full left-0 w-full backdrop-blur-lg">
            <a 
              className="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" 
              href="#estimator"
              onClick={() => setMobileMenuOpen(false)}
            >
              CAD Estimator Workspace
            </a>
            <a 
              className="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" 
              href="#procurement"
              onClick={() => setMobileMenuOpen(false)}
            >
              Supplier links
            </a>
            <a 
              className="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" 
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
            >
              Platform Features
            </a>
            <a 
              className="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" 
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bidding Tiers
            </a>
            <a 
              className="block text-on-surface-variant font-label-mono text-xs uppercase hover:text-brand-blue" 
              href="#"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </a>
            <a 
              className="inline-block w-full text-center bg-brand-purple text-white font-label-mono text-[11px] uppercase py-3 rounded-sm tracking-wider"
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Free Trial
            </a>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        
        {/* Dynamic Glowing Hero Section */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-outline-variant scanlines px-4 sm:px-6">
          <div className="absolute inset-0 z-0">
            {/* Realistic Construction Background Image */}
            <img 
              alt="Construction Site Dusk" 
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30 select-none pointer-events-none" 
              src={IMAGES.heroBg}
              referrerPolicy="no-referrer"
            />
            {/* Ambient Backlighting */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/60 to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/25 to-brand-blue/15 mix-blend-overlay" />
            
            {/* Glowing orbs */}
            <div className="absolute top-[25%] left-[20%] w-[450px] h-[450px] bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[15%] w-[550px] h-[550px] bg-brand-blue/15 rounded-full blur-[160px] pointer-events-none" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-sm font-label-mono text-[10px] text-brand-blue uppercase tracking-widest border border-brand-blue/35 shadow-lg">
                {/* Fixed Overlapping ping icon placement */}
                <div className="relative w-2 h-2 mr-1.5 flex-shrink-0">
                  <span className="absolute w-2 h-2 bg-brand-blue rounded-full animate-ping" />
                  <span className="absolute w-2 h-2 bg-brand-blue rounded-full" />
                </div>
                Live AI bidding system linked
              </div>
              
              <h1 className="font-display-lg text-4xl sm:text-[56px] text-white leading-tight font-black tracking-tight leading-[1.1]">
                Win the bid before you <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-secondary font-black">leave the truck.</span>
              </h1>
              
              <p className="font-body-md text-on-surface-variant max-w-xl text-lg sm:text-xl leading-relaxed text-slate-300">
                Automate itemized estimates, coordinate local code compliance, and lock raw material inventories directly from the field. Skip paperwork after hours.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  className="bg-brand-purple text-white font-label-mono text-[11px] font-bold px-8 py-4 rounded-sm uppercase tracking-wider hover:bg-brand-blue transition-all duration-300 glow-primary flex items-center gap-2" 
                  href="#estimator"
                >
                  Enter Interactive Estimator
                  <ArrowRight size={14} />
                </a>
                <a 
                  className="glass-card text-white font-label-mono text-[11px] font-bold px-8 py-4 rounded-sm uppercase tracking-wider hover:bg-surface-variant transition-all duration-300 flex items-center"
                  href="#comms-terminal"
                >
                  Verify Systems
                </a>
              </div>
            </div>

            {/* Simulated HUD elements right hand side */}
            <div className="lg:col-span-5 relative h-[450px] w-full hidden lg:flex flex-col justify-center items-center">
              <div className="absolute w-[110%] h-[110%] border border-brand-blue/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
              <div className="absolute w-[80%] h-[80%] border border-brand-purple/10 border-dashed rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
              
              {/* Floating Stat metrics */}
              <div className="absolute bottom-6 right-4 glass-panel p-6 rounded-sm w-64 shadow-2xl border border-brand-purple/30 glow-primary">
                <div className="font-label-mono text-[9px] text-brand-purple uppercase tracking-widest mb-1 flex justify-between items-center">
                  <span>Estimating Confidence</span>
                  <TrendingUp size={13} className="text-brand-purple animate-pulse" />
                </div>
                <p className="font-headline-lg text-3xl font-extrabold text-white">98.4%</p>
                <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden mt-3">
                  <div className="bg-gradient-to-r from-brand-purple to-brand-blue h-full w-[98.4%]" />
                </div>
              </div>

              <div className="absolute top-6 left-4 glass-panel p-6 rounded-sm w-60 shadow-2xl border border-brand-blue/30">
                <div className="font-label-mono text-[9px] text-brand-blue uppercase tracking-widest mb-1 flex justify-between items-center">
                  <span>Contract Generation</span>
                  <Clock size={13} className="text-on-surface-variant" />
                </div>
                <p className="font-headline-lg text-2xl font-extrabold text-white">1.2 SECS</p>
                <p className="text-[10px] text-on-surface-variant font-label-mono mt-2">Parsed 4,291 materials variables.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 🛠️ Bidding Studio Interactive Main Workspace Suite */}
        <section className="py-24 bg-surface-container-lowest border-b border-outline-variant relative" id="estimator">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 sm:px-margin-page">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-label-mono text-brand-blue uppercase tracking-widest mb-3 block text-xs">
                Interactive Beta Demonstration Area
              </span>
              <h2 className="font-display-lg text-3xl sm:text-4xl text-white font-bold">
                Deploy estimates live on the grid
              </h2>
              <p className="text-on-surface-variant text-base sm:text-lg mt-3 max-w-xl mx-auto">
                Test the drawing board live. Select your crew category, plot points on the blueprint layout below, and see the legal estimate billings compile instantly.
              </p>
            </div>

            {/* Assembly Blueprint CAD Takeoff Board */}
            <BlueprintTakeoff 
              markers={markers}
              onAddMarker={handleAddMarker}
              onClearMarkers={handleClearMarkers}
              onDeleteMarker={handleDeleteMarker}
              selectedTrade={selectedTrade}
              setSelectedTrade={setSelectedTrade}
            />

            {/* Master Valuation Invoice Panel placed neatly underneath */}
            <div className="mt-12 pt-12 border-t border-outline-variant/30">
              <EstimatorPanel
                markers={markers}
                manualItems={manualItems}
                onAddManualItem={handleAddManualItem}
                onRemoveManualItem={handleRemoveManualItem}
                onClearManualItems={handleClearManualItems}
                selectedTrade={selectedTrade}
              />
            </div>
          </div>
        </section>

        {/* Sourcing HUD Links */}
        <section className="py-24 bg-background border-b border-outline-variant relative" id="procurement">
          <div className="max-w-7xl mx-auto px-6 sm:px-margin-page">
            <ProcurementHUD 
              markers={markers} 
              onAddManualItem={handleAddManualItem} 
            />
          </div>
        </section>

        {/* Bento Grid Info Section */}
        <section className="py-28 bg-surface-container-lowest border-b border-outline-variant" id="features">
          <div className="max-w-7xl mx-auto px-6 sm:px-margin-page">
            
            <div className="mb-16 text-left">
              <h2 className="font-label-mono text-brand-blue uppercase tracking-widest mb-3 text-xs">The Overhead Killer</h2>
              <h3 className="font-display-lg text-3xl sm:text-4xl text-white max-w-2xl font-bold">
                Manual admin costs you billable hours.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[280px] gap-6">
              
              {/* Bento Cell 1 (Span 8) */}
              <div className="md:col-span-8 md:row-span-2 rounded-lg border border-outline-variant bg-surface-container relative overflow-hidden group">
                <img 
                  alt="Industrial Blueprint Design" 
                  className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-65 group-hover:scale-[1.03] transition-all duration-700" 
                  src={IMAGES.blueprintBento}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full text-left">
                  <div className="glass-card inline-block px-3 py-1 rounded-sm text-brand-blue font-label-mono text-[10px] uppercase mb-4 border border-brand-blue/30">
                    Proprietary Takeoff Technology
                  </div>
                  <h4 className="font-headline-lg text-2xl text-white font-bold mb-2">Automated Field Plan Recognition</h4>
                  <p className="text-on-surface-variant max-w-md text-sm sm:text-base leading-relaxed">
                    Upload simple sketches, photos of hand notations, or raw engineering mockups. Our blueprint engine extracts the metrics directly.
                  </p>
                </div>
              </div>

              {/* Bento Cell 2 (Span 4) */}
              <div className="md:col-span-4 rounded-lg border border-outline-variant bg-surface-container relative overflow-hidden flex flex-col justify-end p-8 group text-left min-h-[280px]">
                <img 
                  alt="High Precision Sourcing Panels" 
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-[1.04] transition-all duration-700 pointer-events-none" 
                  src={IMAGES.tradeLinkages}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] font-label-mono text-brand-purple bg-black/80 border border-brand-purple/30 px-3 py-1 rounded-sm tracking-wider mb-4 inline-block shadow-lg">
                    DISTRIBUTOR NETWORK
                  </span>
                  <h4 className="font-headline-lg text-lg text-white font-bold">Trade-Specific Linkages</h4>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Instantly synchronized inventories across commercial heavy electrical and plumbing providers.
                  </p>
                </div>
              </div>

              {/* Bento Cell 3 (Span 4) */}
              <div className="md:col-span-4 rounded-lg border border-outline-variant bg-surface-container p-8 flex flex-col justify-between hover:border-brand-purple/50 transition-colors text-left">
                <div>
                  <p className="font-label-mono text-brand-purple uppercase text-[10px] tracking-wider mb-2 font-bold">Standard Contractor Waste</p>
                  <h4 className="font-display-lg text-4xl text-white font-black leading-none">14 HRS/WK</h4>
                </div>
                <div className="pt-4 border-t border-outline-variant/40">
                  <p className="text-on-surface-variant text-xs sm:text-sm">
                    Normally squandered compiling itemized material takeoffs and invoice compliance manually.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 📚 Three Step sticky cards section */}
        <section className="py-28 bg-background border-b border-outline-variant relative" id="automation">
          <div className="max-w-7xl mx-auto px-6 sm:px-margin-page grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            
            {/* Left Column with Sticky Header Info AND the beautiful 21st.dev Splite comparison component */}
            <div className="lg:col-span-5 lg:sticky top-32 h-fit pb-12 space-y-8">
              <div className="space-y-4">
                <span className="font-label-mono text-brand-purple uppercase text-xs tracking-widest block font-bold">
                  Precision Process
                </span>
                <h2 className="font-display-lg text-3xl sm:text-4xl text-white font-bold leading-tight">
                  The Three-Step Back-Office Automation
                </h2>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                  Streamline operations cleanly from sketchy layouts to official digital estimates right on site.
                </p>
              </div>

              {/* Integrated 21st.dev splite visualizer component here - populates left side beautifully */}
              <div className="pt-2 border-t border-outline-variant/30">
                <Splite />
              </div>
            </div>

            {/* Right column: cards with smooth scrolling, subtle transition hover effects, and full height scroll alignment */}
            <div className="lg:col-span-7 space-y-16 pr-1 relative">
              
              <div className="glass-panel p-8 sm:p-10 rounded-lg border-l-4 border-l-brand-purple border border-transparent hover:border-brand-purple/20 shadow-2xl hover:shadow-brand-purple/20 transition-all duration-300 group bg-surface-container/95 backdrop-blur-sm sticky top-[140px] z-10 self-start">
                <div className="font-label-mono text-brand-purple text-6xl opacity-15 absolute top-6 right-6 font-extrabold group-hover:opacity-30 transition-opacity">01</div>
                <h3 className="font-headline-lg text-xl sm:text-2xl text-white mb-3 font-semibold group-hover:text-brand-purple transition-colors">Feed the System</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed text-slate-300">
                  Snap a crisp photo of your custom field outline sketches, specify job parameters via voice transcriptions, or drag/drop PDF design grids into the CAD layout module.
                </p>
              </div>

              <div className="glass-panel p-8 sm:p-10 rounded-lg border-l-4 border-l-brand-blue border border-transparent hover:border-brand-blue/20 shadow-2xl hover:shadow-brand-blue/20 transition-all duration-300 group bg-surface-container/95 backdrop-blur-sm sticky top-[180px] z-20 self-start">
                <div className="font-label-mono text-brand-blue text-6xl opacity-15 absolute top-6 right-6 font-extrabold group-hover:opacity-30 transition-opacity">02</div>
                <h3 className="font-headline-lg text-xl sm:text-2xl text-white mb-3 font-semibold group-hover:text-brand-blue transition-colors">Coordinate the Estimate</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed text-slate-300">
                  The billing engine automatically calculates raw values, extracts itemized component counts and logistics overhead fees, drafting consistent proposals in under 2 seconds.
                </p>
              </div>

              <div className="glass-panel p-8 sm:p-10 rounded-lg border-l-4 border-l-brand-purple border border-transparent hover:border-brand-purple/30 bg-brand-purple/5 shadow-2xl hover:shadow-brand-purple/25 transition-all duration-300 group bg-surface-container/95 backdrop-blur-sm sticky top-[220px] z-30 self-start">
                <div className="font-label-mono text-brand-purple text-6xl opacity-15 absolute top-6 right-6 font-extrabold group-hover:opacity-30 transition-opacity">03</div>
                <h3 className="font-headline-lg text-xl sm:text-2xl text-white mb-3 font-semibold group-hover:text-brand-purple transition-colors">Authorize and Order</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed text-slate-300">
                  Lock materials directly inside surround linked supplier stocks. Routes pre-populated invoices to your account for commercial logistics dispatch instantly.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Trade Pillars Section */}
        <section className="py-24 bg-surface-container-lowest border-b border-outline-variant">
          <div className="max-w-7xl mx-auto px-6 sm:px-margin-page">
            <div className="text-center mb-16">
              <h2 className="font-display-lg text-3xl text-white font-bold">Engineered for the Crew.</h2>
              <p className="text-on-surface-variant text-sm sm:text-base mt-2">No complicated features or administrative overhead.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              
              {/* Card 1: Site Resistant (Purple Theme, Top Full band, colorful highlights, hover grow/shadow) */}
              <div className="glass-panel rounded-lg bg-surface-container/20 overflow-hidden border border-outline-variant/30 hover:border-brand-purple/40 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(124,58,237,0.18)] transition-all duration-300 flex flex-col group">
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-purple to-pink-500" />
                <div className="p-6 sm:p-8 flex-grow flex flex-col">
                  <h4 className="font-headline-lg text-base sm:text-lg text-white font-bold mb-3 group-hover:text-brand-purple transition-colors">Site Resistant</h4>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed text-slate-300">
                    Engineered with massive high-visibility targets and voice-transcription overrides for busy hands in direct hot solar glare outside.
                  </p>
                </div>
              </div>

              {/* Card 2: Offline Core Sync (Blue Theme, Top Full band, colorful highlights, hover grow/shadow) */}
              <div className="glass-panel rounded-lg bg-surface-container/20 overflow-hidden border border-outline-variant/30 hover:border-brand-blue/40 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(64,133,236,0.18)] transition-all duration-300 flex flex-col group">
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue to-emerald-400" />
                <div className="p-6 sm:p-8 flex-grow flex flex-col">
                  <h4 className="font-headline-lg text-base sm:text-lg text-white font-bold mb-3 group-hover:text-brand-blue transition-colors">Offline Core Sync</h4>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed text-slate-300">
                    Remote jobs lack consistent signals. Foreman is optimized for native offline state caches, queuing contract drafts to dispatch on active connections.
                  </p>
                </div>
              </div>

              {/* Card 3: Deep Code Logic (Purple Theme, Top Full band, colorful highlights, hover grow/shadow) */}
              <div className="glass-panel rounded-lg bg-surface-container/20 overflow-hidden border border-outline-variant/30 hover:border-brand-purple/40 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(124,58,237,0.18)] transition-all duration-300 flex flex-col group">
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-purple to-indigo-500" />
                <div className="p-6 sm:p-8 flex-grow flex flex-col">
                  <h4 className="font-headline-lg text-base sm:text-lg text-white font-bold mb-3 group-hover:text-brand-purple transition-colors">Deep Code Logic</h4>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed text-slate-300">
                    Configured around dynamic commercial guidelines in Plumbing, Electrical grid specs, and HVAC airflow counts to protect project approvals.
                  </p>
                </div>
              </div>

              {/* Card 4: Profit Protection (Blue Theme, Top Full band, colorful highlights, hover grow/shadow) */}
              <div className="glass-panel rounded-lg bg-surface-container/20 overflow-hidden border border-outline-variant/30 hover:border-brand-blue/40 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(64,133,236,0.18)] transition-all duration-300 flex flex-col group">
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue to-indigo-600" />
                <div className="p-6 sm:p-8 flex-grow flex flex-col">
                  <h4 className="font-headline-lg text-base sm:text-lg text-white font-bold mb-3 group-hover:text-brand-blue transition-colors">Profit Protection</h4>
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed text-slate-300">
                    Constantly queries materials pricing spikes to guard your gross target margin constraints against unexpected inflation.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing tier section */}
        <section className="py-28 bg-background border-b border-outline-variant relative" id="pricing">
          <div className="max-w-7xl mx-auto px-6 sm:px-margin-page">
            
            <div className="text-center max-w-3xl mx-auto mb-20 text-center">
              <span className="font-label-mono text-brand-purple uppercase tracking-widest text-xs font-bold block mb-2">
                Flexible Licensing
              </span>
              <h2 className="font-display-lg text-3xl sm:text-4xl text-white font-bold mb-4">Invest in operational speed.</h2>
              <p className="text-on-surface-variant text-base sm:text-lg">
                Choose the scope appropriate for your crew count. Modify or cancel active trials seamlessly.
              </p>

              {/* billing switcher */}
              <div className="inline-flex bg-surface-variant p-1 rounded-sm border border-outline-variant mt-8 items-center gap-1">
                <button
                  onClick={() => setPricingPeriod('monthly')}
                  className={`px-4 py-1.5 font-label-mono text-[10px] rounded-sm uppercase ${
                    pricingPeriod === 'monthly' ? 'bg-brand-purple text-white shadow' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  Monthly billing
                </button>
                <button
                  onClick={() => setPricingPeriod('annually')}
                  className={`px-4 py-1.5 font-label-mono text-[10px] rounded-sm uppercase ${
                    pricingPeriod === 'annually' ? 'bg-brand-purple text-white shadow' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  Annually (-20%)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* Tier 1 */}
              <div className="glass-panel p-8 rounded-lg border border-outline-variant flex flex-col justify-between text-left">
                <div>
                  <h3 className="font-label-mono text-[11px] text-on-surface-variant uppercase tracking-widest mb-1.5">Solo Operator</h3>
                  <div className="font-display-lg text-4xl text-white font-black tracking-tight mb-6">
                    ${pricingPeriod === 'monthly' ? '79' : '63'}{' '}
                    <span className="text-xs font-normal text-on-surface-variant font-sans">/mo</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                    Designed for independent tradesmen automating their custom estimates and contract proposals.
                  </p>
                  <ul className="space-y-4 mb-8 text-xs text-on-surface-variant font-label-mono">
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-purple" />
                      <span>50 Estimates / Month</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-purple" />
                      <span>Voice-to-Text Parsing</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-purple" />
                      <span>Contract Deliverables</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => {
                    setSelectedPkg('solo');
                    const el = document.getElementById('comms-terminal');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-center bg-transparent border border-outline-variant hover:bg-surface-variant text-white font-label-mono text-xs py-3.5 rounded-sm uppercase tracking-widest font-bold block transition-all"
                >
                  Select Solo Plan
                </button>
              </div>

              {/* Tier 2 (Highlighted) */}
              <div className="glass-panel p-8 rounded-lg border-2 border-brand-purple bg-surface-container-high/60 relative transform lg:-translate-y-4 flex flex-col justify-between text-left shadow-2xl glow-primary">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-purple text-white font-label-mono px-4 py-1 rounded-sm uppercase text-[9px] font-black tracking-widest">
                  CREW PREFERRED
                </div>
                <div>
                  <h3 className="font-label-mono text-[11px] text-brand-purple uppercase tracking-widest mb-1.5 mt-2">Crew Leader</h3>
                  <div className="font-display-lg text-4xl text-white font-black tracking-tight mb-6">
                    ${pricingPeriod === 'monthly' ? '149' : '119'}{' '}
                    <span className="text-xs font-normal text-on-surface-variant font-sans">/mo</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                    Advanced digital tools for scaling general contractors and active multi-trade teams.
                  </p>
                  <ul className="space-y-4 mb-8 text-xs text-white font-label-mono">
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-blue" />
                      <span className="font-bold">UNLIMITED ESTIMATES</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-blue" />
                      <span>Visual Photo Takeoffs</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-blue" />
                      <span>Distributor API links</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-blue" />
                      <span>Up to 3 Active Users</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => {
                    setSelectedPkg('crew');
                    const el = document.getElementById('comms-terminal');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-center bg-brand-purple hover:bg-brand-blue text-white font-label-mono text-xs py-3.5 rounded-sm uppercase tracking-widest font-bold block transition-all"
                >
                  Deploy Crew License
                </button>
              </div>

              {/* Tier 3 */}
              <div className="glass-panel p-8 rounded-lg border border-outline-variant flex flex-col justify-between text-left">
                <div>
                  <h3 className="font-label-mono text-[11px] text-on-surface-variant uppercase tracking-widest mb-1.5">Fleet Array</h3>
                  <div className="font-display-lg text-4xl text-white font-black tracking-tight mb-6">
                    ${pricingPeriod === 'monthly' ? '299' : '239'}{' '}
                    <span className="text-xs font-normal text-on-surface-variant font-sans">/mo</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                    Comprehensive enterprise-grade tooling for massive contracting and supplier fleets.
                  </p>
                  <ul className="space-y-4 mb-8 text-xs text-on-surface-variant font-label-mono">
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-purple" />
                      <span>Everything in Crew Leader</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-purple" />
                      <span>Enterprise ERP Syncs</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={14} className="text-brand-purple" />
                      <span>Custom Sourcing Catalogs</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => {
                    setSelectedPkg('fleet');
                    const el = document.getElementById('comms-terminal');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-center bg-transparent border border-outline-variant hover:bg-surface-variant text-white font-label-mono text-xs py-3.5 rounded-sm uppercase tracking-widest font-bold block transition-all"
                >
                  Contact Operations
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* 🔒 Secure Transmission / Captcha Form Section */}
        <section className="py-24 bg-background relative" id="contact">
          <div className="max-w-4xl mx-auto px-6 sm:px-margin-page">
            <ContactForm 
              selectedPackage={selectedPkg}
              pricingPeriod={pricingPeriod}
              onChangePackage={setSelectedPkg}
              onChangePricingPeriod={setPricingPeriod}
            />
          </div>
        </section>

        {/* 🌐 Immersive 3D Spatial Twin Workspace Section */}
        <section className="py-24 border-t border-outline-variant/30 bg-background relative overflow-hidden" id="spatial-twin">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 sm:px-margin-page relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-label-mono text-brand-purple uppercase tracking-widest bg-brand-purple/15 border border-brand-purple/25 px-3 py-1 rounded-sm mb-4 inline-block shadow-sm">
                SPATIAL COMPUTING TWIN
              </span>
              <h2 className="font-display-lg text-3xl sm:text-4xl text-white font-extrabold tracking-tight mb-4">
                Interactive 3D Workspace
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed text-slate-300">
                Explore real-time spatial models. Rotate, pan, and inspect heavy mechanical & electrical structures with high fidelity directly within your digital workspace.
              </p>
            </div>

            <div className="glass-panel border border-outline-variant/60 rounded-xl overflow-hidden shadow-2xl relative bg-surface-container/20 p-2 sm:p-4">
              <div className="h-[500px] w-full rounded-lg overflow-hidden border border-outline-variant/30 relative">
                <SplineScene 
                  scene="https://prod.spline.design/kZgto605tABo08g8/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 px-2 text-xs font-label-mono text-on-surface-variant/70 uppercase">
                <span>⚡ Interactive 3D Orbit Enabled</span>
                <span>🖱️ Click & Drag to Orbit // Scroll to Zoom</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Modern footer with operational logging watermark */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/60 w-full mt-auto relative">
        {/* Float Back-To-Top button with smooth scrolling */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 bg-brand-purple hover:bg-brand-blue text-white p-3 rounded-full shadow-2xl border border-brand-purple/40 hover:scale-110 transition-transform duration-300 cursor-pointer animate-fade-in flex items-center justify-center glow-primary"
            title="Back to Top"
          >
            <ChevronUp size={18} />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 sm:px-margin-page py-16 max-w-7xl mx-auto text-left text-xs font-label-mono">
          
          <div className="col-span-1 md:col-span-2 space-y-6">
            <a className="flex items-center gap-2" href="#" onClick={() => setActivePage('home')}>
              <Logo variant="light" height={24} />
            </a>
            <p className="text-on-surface-variant max-w-sm leading-relaxed uppercase">
              Field intelligence for the modern job site. Automating tedious paperwork so contractors can build the world.
            </p>
            
            {/* Added social media links below description - LinkedIn, YouTube, Facebook, and Instagram only */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 border border-outline-variant/50 rounded-sm hover:border-brand-purple hover:text-brand-purple text-on-surface-variant transition-colors" title="LinkedIn">
                <Linkedin size={15} />
              </a>
              <a href="#" className="p-2 border border-outline-variant/50 rounded-sm hover:border-brand-blue hover:text-brand-blue text-on-surface-variant transition-colors" title="YouTube">
                <Youtube size={15} />
              </a>
              <a href="#" className="p-2 border border-outline-variant/50 rounded-sm hover:border-brand-purple hover:text-brand-purple text-on-surface-variant transition-colors" title="Facebook">
                <Facebook size={15} />
              </a>
              <a href="#" className="p-2 border border-outline-variant/50 rounded-sm hover:border-brand-blue hover:text-brand-blue text-on-surface-variant transition-colors" title="Instagram">
                <Instagram size={15} />
              </a>
            </div>

            <p className="text-[10px] text-on-surface-variant/50">
              © 2026 FOREMAN AI INC. ALL REGIONAL SYSTEMS SECURED.
            </p>
          </div>

          <div className="col-span-1 space-y-3">
            <h4 className="text-brand-blue font-bold uppercase tracking-widest">Workspace tools</h4>
            <ul className="space-y-2">
              <li><a className="text-on-surface-variant hover:text-white transition-colors" href="#estimator">CAD Estimator</a></li>
              <li><a className="text-on-surface-variant hover:text-white transition-colors" href="#procurement">Live catalogs</a></li>
              <li><a className="text-on-surface-variant hover:text-white transition-colors" href="#pricing">License structures</a></li>
              <li><a className="text-on-surface-variant hover:text-white transition-colors" href="#">Blog</a></li>
            </ul>
          </div>

          <div className="col-span-1 space-y-3">
            <h4 className="text-brand-blue font-bold uppercase tracking-widest">Legal & Regulatory</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActivePage('terms')}
                  className="text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left uppercase text-[10px]"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('privacy')}
                  className="text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left uppercase text-[10px]"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('policy')}
                  className="text-on-surface-variant hover:text-white transition-colors cursor-pointer text-left uppercase text-[10px]"
                >
                  Procurement Policy
                </button>
              </li>
              <li>
                <span className="text-on-surface-variant/60">Standard TLS Secured</span>
              </li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}
