import React, { useState, useEffect } from 'react';
import { Send, ShieldAlert, CheckSquare, Loader2, Sparkles, ChevronDown, RefreshCw } from 'lucide-react';

interface ContactFormProps {
  selectedPackage?: string;
  pricingPeriod?: 'monthly' | 'annually';
  onChangePackage?: (pkg: string) => void;
  onChangePricingPeriod?: (period: 'monthly' | 'annually') => void;
}

export default function ContactForm({
  selectedPackage = 'crew',
  pricingPeriod = 'monthly',
  onChangePackage,
  onChangePricingPeriod
}: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pkg, setPkg] = useState(selectedPackage);
  const [localPeriod, setLocalPeriod] = useState<'monthly' | 'annually'>(pricingPeriod);
  const [message, setMessage] = useState('');
  const [captcha, setCaptcha] = useState('');
  
  // Random math captcha state
  const [captchaProblem, setCaptchaProblem] = useState({ text: '8 + 5', answer: '13' });

  // Status states
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');
  const [progressLogs, setProgressLogs] = useState<string[]>([]);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // Sync state with parent props when they change (e.g. from the pricing section buttons)
  useEffect(() => {
    if (selectedPackage) {
      setPkg(selectedPackage);
    }
  }, [selectedPackage]);

  useEffect(() => {
    if (pricingPeriod) {
      setLocalPeriod(pricingPeriod);
    }
  }, [pricingPeriod]);

  // Generate a random math captcha
  const generateCaptcha = () => {
    const val1 = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const val2 = Math.floor(Math.random() * 7) + 3; // 3 to 9
    const answer = val1 + val2;
    setCaptchaProblem({
      text: `Solve security check: What is ${val1} + ${val2}?`,
      answer: String(answer)
    });
  };

  // Generate once on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const triggerMockTransmit = () => {
    // Math captcha check
    if (captcha.trim() !== captchaProblem.answer) {
      setStatus('error');
      setErrorText(`SECURITY PROTOCOL REJECTED: Incorrect math challenge response. Please try again.`);
      generateCaptcha(); // regenerate on fail
      setCaptcha('');
      return;
    }

    if (!name.trim() || !email.trim()) {
      setStatus('error');
      setErrorText('TRANSMISSION FAIL: Please complete Operator Name and Comm Link Email fields.');
      return;
    }

    setStatus('transmitting');
    setProgressLogs([]);
    setSimulatedProgress(0);
    setErrorText('');

    const logs = [
      'SHIELD SYSTEM PROTOCOLS INITIATED...',
      'CONNECTING TO CENTRAL SATELLITE ARRAY...',
      'PARSING REGIONAL SUPPLY NETWORKS...',
      'GENERATING AUTONOMOUS CONTRACT AGREEMENTS...',
      'CONFIRMING LOCAL CODE COMPLIANCE FILINGS...',
      'BROKERING INVENTORY LOCK PROTOCOLS...',
      'DATA STREAM RECONCILED. COMMS LOCKED!'
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setProgressLogs(prev => [...prev, logs[currentLogIdx]]);
        setSimulatedProgress(prev => Math.min(prev + 15, 100));
        currentLogIdx++;
      } else {
        setSimulatedProgress(100);
        setStatus('success');
        clearInterval(interval);
      }
    }, 700);
  };

  const handlePackageChange = (newPkg: string) => {
    setPkg(newPkg);
    if (onChangePackage) {
      onChangePackage(newPkg);
    }
  };

  const handlePeriodChange = (newPeriod: 'monthly' | 'annually') => {
    setLocalPeriod(newPeriod);
    if (onChangePricingPeriod) {
      onChangePricingPeriod(newPeriod);
    }
  };

  return (
    <div className="glass-panel p-10 md:p-16 rounded-lg border border-outline-variant reveal-on-scroll is-visible" id="comms-terminal">
      <div className="text-center mb-12">
        <h2 className="font-display-lg text-3xl text-white mb-4">Initialize Connection</h2>
        <p className="text-on-surface-variant font-label-mono text-xs uppercase tracking-widest">
          Secure Foreman Comms Encrypted Channel
        </p>
      </div>

      {status === 'success' ? (
        <div className="text-center py-8 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue/10 border border-brand-blue text-brand-blue">
            <CheckSquare size={32} />
          </div>
          <h3 className="font-headline-lg text-2xl text-white">Transmission Broadcast Complete</h3>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto">
            Operational telemetry has been synced with Foreman AI Systems. Your regional supplier linkages have been queried for inventory lock values. Check your inbox ({email}) for final dispatch values.
          </p>
          <div className="bg-surface-dim/50 p-4 rounded-sm border border-outline-variant max-w-md mx-auto text-left font-label-mono text-[10px] text-brand-blue space-y-1">
            <p className="font-bold">TRANSMITTED METRICS SUMMARY:</p>
            <p>OPERATOR: {name.toUpperCase()}</p>
            <p>TIER: {pkg.toUpperCase()} ({localPeriod.toUpperCase()})</p>
            <p>STREAMS: SECURE WEBSOCKET FEED STABLE</p>
          </div>
          <button
            onClick={() => {
              setStatus('idle');
              setName('');
              setEmail('');
              setMessage('');
              setCaptcha('');
              setSimulatedProgress(0);
              generateCaptcha();
            }}
            className="bg-brand-purple text-white font-label-mono text-xs px-8 py-3 rounded-sm uppercase tracking-wider hover:bg-brand-blue transition-colors"
          >
            Acknowledge & Refresh Terminals
          </button>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); triggerMockTransmit(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="font-label-mono text-xs text-on-surface-variant uppercase block" htmlFor="name">
                Operator Name
              </label>
              <input
                className="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors font-label-mono text-sm outline-none placeholder-on-surface-variant/40"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="E.G. J. DOE"
                type="text"
                required
              />
            </div>
            <div className="space-y-4">
              <label className="font-label-mono text-xs text-on-surface-variant uppercase block" htmlFor="email">
                Comm Link Email
              </label>
              <input
                className="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors font-label-mono text-sm outline-none placeholder-on-surface-variant/40"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E.G. COMPANY@HQ.COM"
                type="email"
                required
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
                <label className="font-label-mono text-xs text-on-surface-variant uppercase block" htmlFor="package">
                  Preferred Service Package & Billing
                </label>
                
                {/* Billing toggle switcher inline */}
                <div className="flex items-center gap-1.5 p-0.5 bg-surface-dim border border-outline-variant/50 rounded-sm">
                  <button
                    type="button"
                    onClick={() => handlePeriodChange('monthly')}
                    className={`px-3 py-1 text-[10px] font-label-mono uppercase rounded-sm transition-all ${
                      localPeriod === 'monthly' ? 'bg-brand-purple text-white shadow' : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePeriodChange('annually')}
                    className={`px-3 py-1 text-[10px] font-label-mono uppercase rounded-sm transition-all ${
                      localPeriod === 'annually' ? 'bg-brand-purple text-white shadow' : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    Annually (-20%)
                  </button>
                </div>
              </div>

              {/* Package Select field wrapper for down arrow */}
              <div className="relative">
                <select
                  className="w-full bg-surface-variant border border-outline-variant text-white pl-4 pr-10 py-3 rounded-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors font-label-mono text-sm outline-none appearance-none cursor-pointer"
                  id="package"
                  value={pkg}
                  onChange={e => handlePackageChange(e.target.value)}
                >
                  {localPeriod === 'monthly' ? (
                    <>
                      <option value="solo">Solo Operator Plan ($79/mo)</option>
                      <option value="crew">Crew Leader Workspace ($149/mo)</option>
                      <option value="fleet">Fleet Array Enterprise ($299/mo)</option>
                    </>
                  ) : (
                    <>
                      <option value="solo">Solo Operator Plan ($63/mo - Billed Annually)</option>
                      <option value="crew">Crew Leader Workspace ($119/mo - Billed Annually)</option>
                      <option value="fleet">Fleet Array Enterprise ($239/mo - Billed Annually)</option>
                    </>
                  )}
                </select>
                
                {/* Custom indicator arrow for select - fixed missing down arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/80">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-label-mono text-xs text-on-surface-variant uppercase block" htmlFor="message">
              Transmission Job Parameters / Notes
            </label>
            <textarea
              className="w-full bg-surface-variant border border-outline-variant text-white px-4 py-3 rounded-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors font-body-md text-sm outline-none placeholder-on-surface-variant/40 resize-none"
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="What job scopes, materials count, or trade properties would you like Foreman AI to parse? (E.g. Install 15 outlets and 4 HVAC floor air vents)..."
              rows={4}
            />
          </div>

          {/* Math Captcha Security Protection */}
          <div className="pt-6 border-t border-outline-variant flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
            <div className="space-y-4 w-full md:w-2/3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-purple" />
                <label className="font-label-mono text-xs text-brand-purple uppercase tracking-widest" htmlFor="captcha">
                  Human verification Security check
                </label>
              </div>
              <div className="glass-panel p-4 rounded-sm border border-brand-purple/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="font-body-md text-white text-sm flex-grow">
                  {captchaProblem.text}
                </span>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2 border border-outline-variant hover:bg-surface-variant text-on-surface-variant hover:text-white rounded-sm transition-colors"
                    title="Generate new formula"
                  >
                    <RefreshCw size={14} className="animate-hover-spin" />
                  </button>
                  <div className="relative w-full sm:w-24">
                    <input
                      className="w-full bg-surface-dim border border-brand-purple/50 text-center text-white px-2 py-2 rounded-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all font-label-mono text-lg outline-none glow-primary"
                      id="captcha"
                      value={captcha}
                      onChange={e => setCaptcha(e.target.value)}
                      placeholder="?"
                      type="text"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-white text-background font-label-mono text-xs px-10 py-5 rounded-sm uppercase tracking-widest font-bold hover:bg-brand-blue hover:text-white transition-all duration-300 glow-primary magnetic self-end flex items-center justify-center gap-2"
            >
              <Send size={12} />
              Transmit Data
            </button>
          </div>

          {/* Error messages */}
          {status === 'error' && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-sm text-xs font-label-mono text-red-400 flex items-start gap-2">
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Sourcing logs console stream */}
          {status === 'transmitting' && (
            <div className="p-4 bg-black/90 border border-brand-blue/30 rounded-sm space-y-3 font-mono text-[11px] text-brand-blue">
              <div className="flex justify-between items-center">
                <span>COMMS LINK STATUS: RUNNING TRANSMISSIONS</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <Loader2 size={12} className="animate-spin" />
                  {simulatedProgress}%
                </span>
              </div>
              <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-blue h-full transition-all duration-500" 
                  style={{ width: `${simulatedProgress}%` }}
                />
              </div>
              <div className="space-y-1 divide-y divide-outline-variant/10 max-h-[140px] overflow-y-auto pt-2">
                {progressLogs.map((log, idx) => (
                  <p key={idx} className="py-1">
                    🟢 {log}
                  </p>
                ))}
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
