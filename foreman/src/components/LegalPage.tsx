import React, { useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Scale, ScrollText, CheckCircle } from 'lucide-react';
import { Logo } from './Logo';

interface LegalPageProps {
  pageType: 'terms' | 'privacy' | 'policy';
  onBack: () => void;
}

export default function LegalPage({ pageType, onBack }: LegalPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageType]);

  const renderContent = () => {
    switch (pageType) {
      case 'terms':
        return (
          <div className="space-y-8 text-left text-slate-300">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
              <Scale className="text-brand-purple h-6 w-6" />
              <h2 className="font-display-lg text-2xl text-white font-bold uppercase tracking-tight">
                Terms of Service
              </h2>
            </div>
            
            <p className="text-xs font-label-mono text-brand-purple uppercase tracking-widest bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-sm inline-block">
              REVISED JUNE 2026 // VERSION 4.2
            </p>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">1. System Operator Authorization</h3>
              <p className="text-sm leading-relaxed">
                By initializing this Foreman AI workspace, the operating individual ("Operator") represents and warrants that they possess the necessary professional trade licenses and credentials to execute construction takeoff configurations. This application serves as a structural calculation aid. The operator retains sole responsibility for verifying all computer-generated coordinate counts before placing physical raw material orders with third-party suppliers.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">2. Manual Calibration & Takeoff Overrides</h3>
              <p className="text-sm leading-relaxed">
                The integrated takeoff visualizer relies on deep vector alignment algorithms to identify junction box layouts, conduit lengths, and automated CAD counts. The Operator is actively encouraged to use the manual pointer calibration tools to override, supplement, or completely erase any misplaced system nodes. All final estimates, bids, and logistics agreements are verified solely on the physical sign-off of the certified on-site foreman.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">3. Billing, Subscriptions & Dispatch Terms</h3>
              <p className="text-sm leading-relaxed">
                Subscription licenses are billed depending on the preferred cycle selected under the active platform dashboard (Solo, Crew, or Fleet). All payments are handled via secure third-party processing gateways. Subscriptions automatically renew at the beginning of each billing period unless cancelled through the digital portal or customer profile prior to renewal. Taxes, commercial carrier freight surcharges, and local supplier reservation fees are calculated dynamically on checkout.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">4. No Warranty and Limitation of Liability</h3>
              <p className="text-sm leading-relaxed">
                FOREMAN AI SYSTEMS ARE PROVIDED "AS IS" WITHOUT EXPRESS OR IMPLIED WARRANTY OF ANY KIND, INCLUDING BUT NOT LIMITED TO MECHANICAL FEASIBILITY FOR LOCAL MUNICIPAL CODE APPROVALS. IN NO EVENT SHALL THE SERVICE CORPORATE ENTITIES BE LIABLE FOR ON-SITE DELAYS, MATERIAL SHORTAGES, OR MUNICIPAL INSPECTION CITATIONS ARISING FROM DRAFT ESTIMATOR ESTIMATES.
              </p>
            </section>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-8 text-left text-slate-300">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
              <ShieldAlert className="text-brand-blue h-6 w-6" />
              <h2 className="font-display-lg text-2xl text-white font-bold uppercase tracking-tight">
                Privacy & Blueprint Data Policy
              </h2>
            </div>

            <p className="text-xs font-label-mono text-brand-blue uppercase tracking-widest bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded-sm inline-block">
              SECURED UNDER LOCAL PROTOCOLS
            </p>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">1. Drawing and Isometric Data Caching</h3>
              <p className="text-sm leading-relaxed">
                When drawings or sketches are uploaded or configured, the vector points, coordinate markers, and trade descriptions are processed securely. This proprietary architectural data is cached locally inside the secure sandbox environment of the active operating machine to support reliable offline capability in areas with unstable commercial cellular coverage.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">2. Telemetry and Model Sourcing Logs</h3>
              <p className="text-sm leading-relaxed">
                Systems process structural logs consisting of grid densities, node configurations, and anonymized bill of material counts to optimize the automated neural layout engines. This processing excludes geographical proprietary coordinates or structural indicators that would compromise commercial project competition.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">3. Third-Party Supplier Integration Privacy</h3>
              <p className="text-sm leading-relaxed">
                To crosscheck inventory availability in real-time under our procurement HUD, requested item descriptions are queried against verified local industrial supplier APIs. The platform guarantees that no proprietary blueprint files, layout drawings, or client project naming tags are forwarded to distributor database systems during these availability scans.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">4. Absolute Non-Sale of Client Blueprint Data</h3>
              <p className="text-sm leading-relaxed">
                Floor plans, estimated material expenses, bid pricing details, and operator telemetry compiled by Foreman AI are handled with maximum security. Under zero circumstances is operational system information sold, shared, or compiled for marketing aggregation providers.
              </p>
            </section>
          </div>
        );

      case 'policy':
        return (
          <div className="space-y-8 text-left text-slate-300">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
              <ScrollText className="text-brand-purple h-6 w-6" />
              <h2 className="font-display-lg text-2xl text-white font-bold uppercase tracking-tight">
                Procurement & Sourcing Policy
              </h2>
            </div>

            <p className="text-xs font-label-mono text-brand-purple uppercase tracking-widest bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-sm inline-block">
              COMMERCIAL PROCUREMENT STANDARDS
            </p>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">1. Live Procurement Stock Inquiries</h3>
              <p className="text-sm leading-relaxed">
                Stock levels indicated under our procurement widgets represent current, verified inventory indexes shared by heavy-industry commercial distributors. External logistics systems refresh these quotas progressively. Prices are subject to instant modification at any time by distributors based on market metal volatility, copper futures, and regional shipping rates.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">2. Autonomous Material Reservation Locks</h3>
              <p className="text-sm leading-relaxed">
                Material quantities selected for dispatch through the digital system are cached conditionally. These temporary reservations expire after two consecutive hours unless completed via direct digital checkout. Expired reservation locks are recycled immediately back to public distribution pipelines to prevent material stock cornering by general contractors.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-headline-lg text-lg text-white font-semibold">3. Logistics Dispatch & Order Reconciliations</h3>
              <p className="text-sm leading-relaxed">
                Procured inventory dispatch is handled in accordance with local distribution standards of selected regional commercial hubs. Standard transit intervals, freight rates, and mechanical load limits apply on checkout. All material discrepancies, short-slipped deliveries, or logistical routing changes must be reported to the issuing distributor's regional operations branch.
              </p>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-brand-purple/30 selection:text-white">
      <div className="grain-overlay" />
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Bar for Legal Pages */}
      <header className="border-b border-outline-variant/30 backdrop-blur-md sticky top-0 bg-background/80 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo variant="light" height={28} />
          
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 border border-outline-variant hover:border-white text-on-surface-variant hover:text-white font-label-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-sm transition-all cursor-pointer bg-surface-dim"
          >
            <ArrowLeft size={12} />
            Back to Console
          </button>
        </div>
      </header>

      {/* Main Editorial Content Container */}
      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 relative z-10">
        <div className="mb-12">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-label-mono text-on-surface-variant hover:text-brand-blue transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={12} />
            Home Console
          </button>
          
          <h1 className="font-display-lg text-4xl sm:text-5xl text-white font-extrabold tracking-tight mb-2">
            Legal Protocols
          </h1>
          <p className="text-on-surface-variant text-sm font-label-mono uppercase tracking-widest">
            Foreman AI Regulatory Standards Drawer
          </p>
        </div>

        {/* Dynamic Legal Layout */}
        <div className="glass-panel p-8 sm:p-12 rounded-lg border border-outline-variant/60 shadow-2xl relative bg-surface-container/30">
          {renderContent()}
        </div>

        {/* Regulatory Bottom Callout */}
        <div className="mt-12 text-center text-on-surface-variant/40 font-label-mono text-[10px] uppercase leading-relaxed max-w-xl mx-auto">
          Compliance validated. These guidelines conform to global construction logistics policies. No manual phone numbers or unencrypted communication channels are exposed under standard sandbox protocols.
        </div>
      </main>
    </div>
  );
}
