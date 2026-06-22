import React, { useState } from 'react';
import { Search, RotateCcw, AlertCircle, ShoppingCart } from 'lucide-react';
import { SupplierItem, TakeoffMarker } from '../types';

interface ProcurementHUDProps {
  markers: TakeoffMarker[];
  onAddManualItem: (item: any) => void;
}

export default function ProcurementHUD({ markers, onAddManualItem }: ProcurementHUDProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'electrical' | 'plumbing' | 'hvac'>('all');

  const suppliersList: SupplierItem[] = [
    { id: 'copper_wire', name: 'COPPER CABLE 12/2 ROMEX ROLL (250FT)', price: 114.99, unit: 'Roll', stockStatus: 'IN STOCK', category: 'electrical' },
    { id: 'cable_run', name: 'COPPER CABLE 12/2 ROMEX ROW (10FT)', price: 4.59, unit: 'Pc', stockStatus: 'IN STOCK', category: 'electrical' },
    { id: 'breaker', name: 'SQUARE D QO 20 AMP BREAKER', price: 8.99, unit: 'Ea', stockStatus: 'IN STOCK', category: 'electrical' },
    { id: 'junction_box', name: 'UL METALLIC J-BOX 4-INCH', price: 3.25, unit: 'Ea', stockStatus: 'LOW STOCK', category: 'electrical' },
    { id: 'pvc_pipe', name: 'SCH 40 PVC PIPE 2-INCH x 10FT', price: 12.50, unit: 'Pc', stockStatus: 'IN STOCK', category: 'plumbing' },
    { id: 'brass_valve', name: 'APOLLO BRASS SHUTOFF BALL VALVE 3/4"', price: 24.95, unit: 'Ea', stockStatus: 'IN STOCK', category: 'plumbing' },
    { id: 'drain_trap', name: 'PVC P-TRAP ASSEMBLY 1-1/2"', price: 18.50, unit: 'Ea', stockStatus: 'LOW STOCK', category: 'plumbing' },
    { id: 'vent', name: 'STEEL FLOOR AIR REGISTER vent 4x10', price: 14.20, unit: 'Ea', stockStatus: 'IN STOCK', category: 'hvac' },
    { id: 'ducting', name: 'INSULATED FLEXIBLE DUCTING 6" x 25FT', price: 38.00, unit: 'Pc', stockStatus: 'IN STOCK', category: 'hvac' },
    { id: 'thermostat', name: 'HONEYWELL T3 INTUITIVE CONTROL SWITCH', price: 89.00, unit: 'Ea', stockStatus: 'OUT OF STOCK', category: 'hvac' },
  ];

  const filteredSuppliers = suppliersList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate quantities of items plotted on the blueprint takeoff
  const countMarkType = (typeId: string) => {
    return markers.filter(m => m.type === typeId).length;
  };

  return (
    <div className="glass-panel p-6 rounded-lg border border-outline-variant/60" id="procurement-tracker">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="font-label-mono text-[10px] text-brand-blue uppercase tracking-widest block mb-1">
            Supplier Linkages & APIS
          </span>
          <h3 className="font-headline-lg text-2xl text-white">Commercial Sourcing Radar</h3>
        </div>

        {/* Live inventory indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-sm font-label-mono text-[10px] uppercase">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          CREW NETWORK ACTIVE
        </div>
      </div>

      <p className="text-sm text-on-surface-variant mb-6">
        Procure materials over real distributor catalogs. Live prices update with surrounding inventory databases.
      </p>

      {/* Sourcing controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search parts directory..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-surface-variant border border-outline-variant text-white pl-9 pr-4 py-2 rounded-sm text-xs focus:border-brand-blue outline-none"
          />
        </div>

        <div className="flex bg-surface-variant p-0.5 rounded-sm border border-outline-variant">
          {(['all', 'electrical', 'plumbing', 'hvac'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 font-label-mono text-[10px] rounded-sm uppercase transition-colors ${
                selectedFilter === f
                  ? 'bg-brand-blue/20 text-brand-blue font-bold border border-brand-blue/30'
                  : 'text-on-surface-variant hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid list of supplier catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-xs font-label-mono text-on-surface-variant">
            No matching items found in commercial linked accounts.
          </div>
        ) : (
          filteredSuppliers.map(item => {
            const plottedQty = countMarkType(item.id);
            return (
              <div 
                key={item.id} 
                className="hud-border p-4 text-left group hover:bg-brand-purple/5 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-mono text-[9px] text-brand-blue uppercase tracking-wider">
                      {item.category.toUpperCase()}
                    </span>
                    <span className={`font-label-mono text-[9px] px-1.5 py-0.5 rounded-sm ${
                      item.stockStatus === 'IN STOCK' ? 'bg-green-500/10 text-green-400' :
                      item.stockStatus === 'LOW STOCK' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {item.stockStatus}
                    </span>
                  </div>
                  <h5 className="font-medium text-xs text-white uppercase tracking-wide mb-3 min-h-[32px] line-clamp-2">
                    {item.name}
                  </h5>
                </div>

                <div className="flex items-end justify-between mt-2 pt-2 border-t border-outline-variant/30">
                  <div>
                    <span className="font-label-mono text-[10px] text-on-surface-variant/70">SUPPLIER VALUE</span>
                    <p className="font-headline-lg text-lg text-white">
                      ${item.price.toFixed(2)} <span className="text-[10px] text-on-surface-variant">/{item.unit}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {plottedQty > 0 && (
                      <span className="font-label-mono text-[10px] bg-brand-blue/15 text-brand-blue px-2 py-1 rounded-sm border border-brand-blue/30" title="Quantity currently plotted on canvas">
                        Active: {plottedQty}
                      </span>
                    )}
                    <button
                      disabled={item.stockStatus === 'OUT OF STOCK'}
                      onClick={() => onAddManualItem({
                        id: Math.random().toString(36).substr(2, 9),
                        name: item.name,
                        category: item.category,
                        quantity: 1,
                        unitPrice: item.price,
                        unit: item.unit
                      })}
                      className="bg-brand-blue/90 hover:bg-brand-purple disabled:bg-gray-800 disabled:text-gray-500 text-white p-2 rounded-sm transition-colors flex items-center gap-1 text-[10px] font-label-mono uppercase tracking-wider"
                      title="Add to current proposal invoice"
                    >
                      <ShoppingCart size={11} />
                      Procure
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
