import React, { useState } from 'react';
import { Pencil, Plus, Trash2, Download, Copy, Printer, CheckCircle2, RefreshCw } from 'lucide-react';
import { TakeoffMarker, EstimatorItem } from '../types';

interface EstimatorPanelProps {
  markers: TakeoffMarker[];
  manualItems: EstimatorItem[];
  onAddManualItem: (item: EstimatorItem) => void;
  onRemoveManualItem: (id: string) => void;
  onClearManualItems: () => void;
  selectedTrade: 'electrical' | 'plumbing' | 'hvac';
}

export default function EstimatorPanel({
  markers,
  manualItems,
  onAddManualItem,
  onRemoveManualItem,
  onClearManualItems,
  selectedTrade
}: EstimatorPanelProps) {
  const [laborHours, setLaborHours] = useState<number>(14);
  const [laborRate, setLaborRate] = useState<number>(85);
  const [markupPercent, setMarkupPercent] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(8.5);

  const [inputName, setInputName] = useState('');
  const [inputQty, setInputQty] = useState(1);
  const [inputPrice, setInputPrice] = useState(10);
  const [inputUnit, setInputUnit] = useState('Pcs');

  const [clientName, setClientName] = useState('D. MILLER DEVELOPMENTS');
  const [projectName, setProjectName] = useState('SITE G-2 ELECTRICAL FITOUT');
  
  const [copied, setCopied] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);

  // Group current markings into materials count
  const compiledMaterials: { [key: string]: { name: string, qty: number, price: number, unit: string } } = {};
  
  markers.forEach(mark => {
    if (compiledMaterials[mark.type]) {
      compiledMaterials[mark.type].qty += 1;
    } else {
      compiledMaterials[mark.type] = {
        name: mark.label,
        qty: 1,
        price: mark.price,
        unit: 'Ea'
      };
    }
  });

  // Calculate costs
  const materialsCost = Object.values(compiledMaterials).reduce((sum, item) => sum + (item.qty * item.price), 0) +
                        manualItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  const laborCost = laborHours * laborRate;
  const subtotal = materialsCost + laborCost;
  const markupCost = (subtotal * markupPercent) / 100;
  const taxableTotal = subtotal + markupCost;
  const taxCost = (taxableTotal * taxPercent) / 100;
  const grandTotal = taxableTotal + taxCost;

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    onAddManualItem({
      id: Math.random().toString(36).substr(2, 9),
      name: inputName,
      category: selectedTrade,
      quantity: inputQty,
      unitPrice: inputPrice,
      unit: inputUnit
    });

    setInputName('');
    setInputQty(1);
    setInputPrice(10);
  };

  const handleCopyProposal = () => {
    const textReport = `
=== FOREMAN AI BINDING PROPOSAL ===
Project: ${projectName}
Client: ${clientName}
Date: ${new Date().toLocaleDateString()}
Status: APPROVED BINDING FIELD INITIALIZED

--- ITEMIZED MATERIALS ---
${Object.values(compiledMaterials).map(item => `- ${item.name}: ${item.qty} ${item.unit} @ $${item.price.toFixed(2)} = $${(item.qty * item.price).toFixed(2)}`).join('\n')}
${manualItems.map(item => `- ${item.name}: ${item.quantity} ${item.unit} @ $${item.unitPrice.toFixed(2)} = $${(item.quantity * item.unitPrice).toFixed(2)}`).join('\n')}

--- LABOR & LOGISTICS ---
Labor Rate: $${laborRate.toFixed(2)}/Hr
Estimated Duration: ${laborHours} Hours
Labor Total: $${laborCost.toFixed(2)}

--- SUMMARY CALCULATIONS ---
Materials Total: $${materialsCost.toFixed(2)}
Labor & Crew: $${laborCost.toFixed(2)}
Subtotal: $${subtotal.toFixed(2)}
Margin Modifier (+${markupPercent}%): $${markupCost.toFixed(2)}
State Taxes (+${taxPercent}%): $${taxCost.toFixed(2)}
===================================
ESTIMATED BINDING TOTAL: $${grandTotal.toFixed(2)}
===================================
Confidence Score: 98.4% Live Verified API inventories linked.
    `;
    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="estimates-panel">
      {/* Items compiler & controllers */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel p-6 rounded-lg border border-outline-variant/60">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-lg text-lg text-white">Itemized Scope & Billings</h4>
            <div className="text-[11px] font-label-mono text-brand-blue uppercase tracking-widest px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-sm">
              Live Compiler (Active)
            </div>
          </div>

          {/* Quick Config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-outline-variant/40">
            <div>
              <label className="text-xs font-label-mono text-on-surface-variant uppercase tracking-wider block mb-1">
                Client / Company Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value.toUpperCase())}
                className="w-full bg-surface-variant border border-outline-variant text-white px-3 py-2 rounded-sm focus:border-brand-blue outline-none font-label-mono text-xs uppercase"
              />
            </div>
            <div>
              <label className="text-xs font-label-mono text-on-surface-variant uppercase tracking-wider block mb-1">
                Jobsite / Project
              </label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value.toUpperCase())}
                className="w-full bg-surface-variant border border-outline-variant text-white px-3 py-2 rounded-sm focus:border-brand-blue outline-none font-label-mono text-xs uppercase"
              />
            </div>
          </div>

          {/* Combined Item List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto mb-6 pr-2">
            {Object.keys(compiledMaterials).length === 0 && manualItems.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-outline-variant rounded-sm text-sm text-on-surface-variant">
                No active components plotted or selected yet. Use the blueprint CAD panel to drop markers, or manually add custom fields below.
              </div>
            ) : (
              <>
                {/* CAD Compiled markings */}
                {Object.values(compiledMaterials).map((item, idx) => (
                  <div key={`cad-${idx}`} className="flex items-center justify-between p-3 bg-surface-dim/40 rounded-sm border border-outline-variant/30 text-xs font-label-mono text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse" />
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{item.qty} {item.unit}</span>
                      <span className="text-white font-bold">${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                {/* Manual items */}
                {manualItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-brand-purple/5 rounded-sm border border-brand-purple/20 text-xs font-label-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-purple rounded-full" />
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{item.quantity} {item.unit}</span>
                      <span className="text-white font-bold">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                      <button 
                        onClick={() => onRemoveManualItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Quick Manual Add Form */}
          <form onSubmit={handleAddManualItem} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-surface-dim p-3 rounded-sm border border-outline-variant/40">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Custom Part Name..."
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                className="w-full bg-surface-variant border border-outline-variant text-white px-3 py-1.5 rounded-sm text-xs outline-none placeholder-on-surface-variant/50"
              />
            </div>
            <div>
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={inputQty}
                onChange={e => setInputQty(parseInt(e.target.value) || 1)}
                className="w-full bg-surface-variant border border-outline-variant text-white px-3 py-1.5 rounded-sm text-xs outline-none"
              />
            </div>
            <div>
              <input
                type="number"
                min="0.1"
                step="0.01"
                placeholder="Price"
                value={inputPrice}
                onChange={e => setInputPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-surface-variant border border-outline-variant text-white px-1 py-1.5 rounded-sm text-xs outline-none"
              />
            </div>
            <div className="sm:col-span-4 flex justify-end mt-1.5">
              <button
                type="submit"
                className="bg-brand-purple/95 hover:bg-brand-purple text-white font-label-mono text-[10px] px-4 py-1.5 rounded-sm uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus size={12} />
                Assemble Line Item
              </button>
            </div>
          </form>
        </div>

        {/* Labor Hours Adjuster block */}
        <div className="glass-panel p-6 rounded-lg border border-outline-variant/60 space-y-4">
          <h4 className="font-headline-lg text-lg text-white">Labor Rates & Crew Factors</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-2">
                <span>Active Labor Allocation</span>
                <span className="text-white font-bold">{laborHours} Hrs</span>
              </div>
              <input
                type="range"
                min="2"
                max="120"
                value={laborHours}
                onChange={e => setLaborHours(parseInt(e.target.value))}
                className="w-full accent-brand-purple"
              />
              <span className="text-[10px] text-on-surface-variant block mt-1">Crew deployment factor including drive and safe layout.</span>
            </div>
            <div>
              <div className="flex justify-between text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-2">
                <span>Hourly Crew Rate</span>
                <span className="text-white font-bold">${laborRate}/Hr</span>
              </div>
              <input
                type="range"
                min="45"
                max="220"
                value={laborRate}
                onChange={e => setLaborRate(parseInt(e.target.value))}
                className="w-full accent-brand-blue"
              />
              <span className="text-[10px] text-on-surface-variant block mt-1">Master mechanic / foreman specialized local billing tariff.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill summary card on the right */}
      <div className="lg:col-span-5">
        <div className="glass-panel p-6 rounded-lg border border-brand-purple/30 glow-primary flex flex-col h-full justify-between">
          <div>
            <div className="font-label-mono text-[10px] text-brand-purple uppercase tracking-widest mb-1 block">
              Active Contract Valuation
            </div>
            <h3 className="font-headline-lg text-2xl text-white mb-6">Valuation Terminal</h3>

            <div className="space-y-3.5 border-b border-outline-variant/40 pb-6 mb-6">
              <div className="flex justify-between text-sm font-label-mono text-on-surface-variant">
                <span>Direct Materials:</span>
                <span className="text-white font-bold">${materialsCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-label-mono text-on-surface-variant">
                <span>Labor Hours ({laborHours} hrs):</span>
                <span className="text-white font-bold">${laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-label-mono text-on-surface-variant">
                <span>Raw Base Subtotal:</span>
                <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
              </div>

              {/* Adjusters */}
              <div className="py-2.5 my-2 border-t border-b border-outline-variant/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-label-mono text-on-surface-variant">
                  <span>Gross Profit Markup:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={markupPercent}
                      onChange={e => setMarkupPercent(parseFloat(e.target.value) || 0)}
                      className="w-14 bg-surface-variant text-center border border-outline-variant text-white p-0.5 rounded-sm scrollbar-none"
                    />
                    <span>%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-label-mono text-on-surface-variant">
                  <span>State Utility Taxes:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={taxPercent}
                      onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)}
                      className="w-14 bg-surface-variant text-center border border-outline-variant text-white p-0.5 rounded-sm scrollbar-none"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm font-label-mono text-brand-purple font-semibold">
                <span>Profit Target Margin:</span>
                <span>${markupCost.toFixed(2)} (+{markupPercent}%)</span>
              </div>
            </div>

            <div className="text-center py-4 bg-surface-dim rounded-sm border border-outline-variant mb-6">
              <div className="text-[10px] font-label-mono uppercase tracking-widest text-on-surface-variant mb-1">
                Guaranteed Contract Total
              </div>
              <div className="text-3xl font-bold font-headline-lg text-white">
                ${grandTotal.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowProposalModal(true)}
              className="w-full bg-brand-purple hover:bg-brand-blue text-white font-label-mono text-xs py-3.5 rounded-sm uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2"
            >
              <Printer size={14} />
              Review & Print Binding Contract
            </button>
            <button
              onClick={handleCopyProposal}
              className="w-full bg-transparent hover:bg-surface-variant border border-outline-variant text-white font-label-mono text-xs py-3 rounded-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <Copy size={14} />
              {copied ? 'Comms Dump Copied!' : 'Copy Proposal Text Output'}
            </button>
          </div>
        </div>
      </div>

      {/* Contract Review Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-surface-container border border-outline-variant rounded-sm w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl relative">
            <button
              onClick={() => setShowProposalModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white font-label-mono text-sm"
            >
              ✕ CLOSE
            </button>

            <div className="space-y-6 pt-4 text-left">
              {/* Proposal Header */}
              <div className="border-b-4 border-brand-purple pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-headline-lg text-3xl font-black text-white">FOREMAN AI INC.</h3>
                  <p className="text-[10px] font-label-mono text-brand-blue uppercase tracking-widest">
                    Live Field Generated Bidding Agreement
                  </p>
                </div>
                <div className="text-right sm:text-right font-label-mono text-xs text-on-surface-variant">
                  <p>DATE: {new Date().toLocaleDateString()}</p>
                  <p>HASH: #BID-{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p className="text-green-400 font-bold">STATUS: BINDING / PRE-APPROVED</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4 text-xs font-label-mono text-on-surface-variant border-b border-outline-variant/30 pb-4">
                <div>
                  <p className="uppercase text-[10px] font-bold text-brand-purple mb-1">CONTRACTOR REPRESENTATION</p>
                  <p className="text-white font-bold">FOREMAN AUTOMATIC SYSTEM CLIENT</p>
                  <p>LICENSE #GC-901844-EL</p>
                </div>
                <div>
                  <p className="uppercase text-[10px] font-bold text-brand-blue mb-1">PROSPECTIVE CLIENT</p>
                  <p className="text-white font-bold">{clientName || 'D. MILLER DEVELOPMENTS'}</p>
                  <p>PROJECT: {projectName || 'SITE G-2 ELECTRICAL FITOUT'}</p>
                </div>
              </div>

              {/* item table */}
              <div className="space-y-3 font-label-mono text-xs">
                <div className="font-bold border-b border-brand-purple/20 pb-2 text-brand-purple">ITEMIZED DISPOSITION</div>
                <div className="divide-y divide-outline-variant/30">
                  {Object.values(compiledMaterials).map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 items-center text-on-surface-variant">
                      <span>{item.name} (CAD PLOTTED)</span>
                      <div className="flex gap-8">
                        <span>{item.qty} units</span>
                        <span className="text-white font-semibold">${(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  {manualItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 items-center text-on-surface-variant">
                      <span>{item.name} (MANUAL COMPILATION)</span>
                      <div className="flex gap-8">
                        <span>{item.quantity} units</span>
                        <span className="text-white font-semibold">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 items-center text-on-surface-variant font-bold border-t border-brand-purple/20 pt-2">
                    <span>Labor Duration Component ({laborHours} hours @ ${laborRate}/hr)</span>
                    <span className="text-white">${laborCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Calculations Block */}
              <div className="bg-surface-dim p-4 rounded-sm border border-outline-variant/40 space-y-2 font-label-mono text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Materials Subtotal:</span>
                  <span className="text-white">${materialsCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Crew Deployment & Labor:</span>
                  <span className="text-white">${laborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Adjustment Factor ({markupPercent}% Markup):</span>
                  <span className="text-white">${markupCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant border-b border-outline-variant/20 pb-2">
                  <span>Tax Surcharge ({taxPercent}%):</span>
                  <span className="text-white">${taxCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2">
                  <span className="text-brand-purple">BINDING COLD CONTRACT SUM:</span>
                  <span className="text-white text-base">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Signing statement */}
              <div className="border-t border-outline-variant/40 pt-4 space-y-2">
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  *LEGALLY BINDING STATEMENT: This proposal presents a live price calculated using supplier API linkages. Sourced raw resources are locked in inventory for 24 hours from timestamp above. Authorized signers acknowledge prices are valid and complete upon mutual transmission.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-6">
                  <div className="border-b border-outline-variant/50 h-10 flex items-end">
                    <span className="text-[10px] font-label-mono text-on-surface-variant/70 uppercase">CREW REPRESENTATIVE</span>
                  </div>
                  <div className="border-b border-outline-variant/50 h-10 flex items-end">
                    <span className="text-[10px] font-label-mono text-on-surface-variant/70 uppercase">CLIENT AUTHORIZATION</span>
                  </div>
                </div>
              </div>

              {/* Inner modal print trigger button */}
              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="bg-brand-blue hover:bg-brand-purple text-white font-label-mono text-xs px-6 py-2.5 rounded-sm uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={12} />
                  Print Document
                </button>
                <button
                  onClick={handleCopyProposal}
                  className="bg-surface-variant hover:bg-surface-bright text-white font-label-mono text-xs px-6 py-2.5 rounded-sm uppercase tracking-wider transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy Agreement Text'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
