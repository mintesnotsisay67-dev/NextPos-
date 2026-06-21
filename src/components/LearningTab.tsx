/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Calculator, HelpCircle, Eye, Network, Smartphone, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LearningTab() {
  const [taxCalcInput, setTaxCalcInput] = useState<string>('500');
  const [selectedTaxType, setSelectedTaxType] = useState<'VAT' | 'TOT_2' | 'TOT_10' | 'EXEMPT'>('VAT');
  const [activeManualTab, setActiveManualTab] = useState<'taxes' | 'offline' | 'payments'>('taxes');

  // Local Tax Math
  const basePrice = parseFloat(taxCalcInput) || 0;
  let taxRatePercent = 0;
  let label = '';
  let details = '';

  if (selectedTaxType === 'VAT') {
    taxRatePercent = 15;
    label = 'Value Added Tax (VAT)';
    details = 'Standard 15% rate applied to VAT registered enterprises in Ethiopia (turnover > 1 million Birr/year). Required for modern boutiques and grocery chains.';
  } else if (selectedTaxType === 'TOT_2') {
    taxRatePercent = 2;
    label = 'Turn-over Tax on Goods (TOT)';
    details = '2% rate applied to commodities and retail goods sold by micro-merchants who do not meet the VAT registration threshold.';
  } else if (selectedTaxType === 'TOT_10') {
    taxRatePercent = 10;
    label = 'Turn-over Tax on Services (TOT)';
    details = '10% rate applied to professional services, barbershops, or consultancies beneath the VAT registration threshold.';
  } else {
    taxRatePercent = 0;
    label = 'Exempted Commodities';
    details = 'Certain agricultural staples (e.g. Teff grain bags, clean bread wheat, essential medicines) are exempt from domestic consumption taxes to protect citizens.';
  }

  const calculatedTaxAmount = (basePrice * taxRatePercent) / 100;
  const grandTotal = basePrice + calculatedTaxAmount;

  const workflows = [
    {
      title: '1. Store Transaction Locally',
      description: 'Your cashier rings up a sale. NextPOS records the items, computes taxes, and updates stock balances directly inside the secure local database (IndexedDB/WebSQL). No lag, even in deep concrete basement market stores.',
    },
    {
      title: '2. Issue Simulated Receipt',
      description: 'NextPOS outputs an ERCA-compliant layout containing your tin number, store details, computed VAT/TOT breakdown, and a simulated secure QR code. Print immediately over low-energy Bluetooth.',
    },
    {
      title: '3. Sync Buffer Monitoring',
      description: 'A background device listener runs. When cellular or Wi-Fi signal triggers even a tiny 1-bar connection, the queued transactions are organized into a secure synchronization payload.',
    },
    {
      title: '4. Encrypted Cloud Merging',
      description: 'The NextPOS cloud server receives the logs, double-checks for duplicate transaction IDs, resolves any stock counts, and populates your central Live Merchant Analytics Dashboard.',
    },
  ];

  return (
    <div className="py-12 relative min-h-screen text-left bg-[#0F172A] text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs uppercase font-mono bg-emerald-500/10 text-emerald-405 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
            Knowledge Hub & Manuals
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight text-white tracking-tight">
            How NextPOS <span className="text-emerald-500">Works Underlying</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Get up to speed with Ethiopian tax calculations, real-time synchronization pipelines, and instant local merchant setups.
          </p>
        </div>

        {/* Guides Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            id="manual-tab-taxes"
            onClick={() => setActiveManualTab('taxes')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeManualTab === 'taxes'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg'
                : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <Calculator className={`w-6 h-6 mb-3 ${activeManualTab === 'taxes' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <h3 className="text-base font-bold text-white font-display">National Tax Handbook</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">Learn about VAT (15%), TOT (2% & 10%), and tax exemptions.</p>
          </button>

          <button
            id="manual-tab-offline"
            onClick={() => setActiveManualTab('offline')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeManualTab === 'offline'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg'
                : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <Network className={`w-6 h-6 mb-3 ${activeManualTab === 'offline' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <h3 className="text-base font-bold text-white font-display">Sync Pipeline</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">Explore our robust offline transaction queuing system.</p>
          </button>

          <button
            id="manual-tab-payments"
            onClick={() => setActiveManualTab('payments')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              activeManualTab === 'payments'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg'
                : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <Smartphone className={`w-6 h-6 mb-3 ${activeManualTab === 'payments' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <h3 className="text-base font-bold text-white font-display">Merchant Payment QR</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">Configure static payment display for Telebirr & CBE cash check.</p>
          </button>
        </div>

        {/* Dynamic manual segment details */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeManualTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {activeManualTab === 'taxes' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2 text-left">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Interactive Tool</span>
                      <h3 className="text-2xl font-bold font-display text-white">Ethiopian Revenue Authority Compliance</h3>
                      <p className="text-xs text-slate-400">Every retail store in Addis Ababa must account for specific domestic taxation brackets. Test the calculations below in real transaction volumes to see the grand totals:</p>
                    </div>

                    {/* Tax Inputs */}
                    <div className="space-y-4 text-left font-sans">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Base Price (Ethiopian Birr - ETB)</label>
                        <div className="relative rounded-xl shadow-xs">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <span className="text-slate-400 font-mono text-sm font-bold">ETB</span>
                          </div>
                          <input
                            type="number"
                            id="tax-calc-input"
                            value={taxCalcInput}
                            onChange={(e) => setTaxCalcInput(e.target.value)}
                            className="block w-full pl-14 pr-4 py-3 border border-slate-800 bg-[#1E293B] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono text-white"
                            placeholder="e.g. 1000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select National Tax Category Preset</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { type: 'VAT', rate: '15%', title: 'VAT' },
                            { type: 'TOT_2', rate: '2%', title: 'TOT Goods' },
                            { type: 'TOT_10', rate: '10%', title: 'TOT Serv.' },
                            { type: 'EXEMPT', rate: '0%', title: 'Exempt' }
                          ].map((item) => (
                            <button
                              key={item.type}
                              id={`tax-type-btn-${item.type}`}
                              onClick={() => setSelectedTaxType(item.type as any)}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                selectedTaxType === item.type
                                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                                  : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                              }`}
                            >
                              <p className="text-xs font-bold">{item.title}</p>
                              <p className="text-[10px] font-mono mt-0.5 opacity-80">{item.rate}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Educational summary parameters */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2 text-xs text-slate-300 text-left font-sans">
                      <p className="font-bold text-white flex items-center">
                        <BookOpen className="w-4 h-4 mr-1.5 text-emerald-400" />
                        About {label}
                      </p>
                      <p className="leading-relaxed">
                        {details}
                      </p>
                    </div>
                  </div>

                  {/* Simulated Bill Output Screen */}
                  <div className="lg:col-span-5 bg-[#17253e] rounded-2xl p-6 border border-slate-800 flex flex-col font-mono text-xs text-slate-300 space-y-4 shadow-xl">
                    <div className="text-center border-b border-dashed border-slate-700 pb-4">
                      <h4 className="font-bold text-sm tracking-tight text-white font-display">SIMULATED NEXTPOS INVOICE</h4>
                      <p className="text-[9px] text-slate-400 mt-1">BOLE DISTRICT ROAD, ADDIS ABABA</p>
                      <p className="text-[9px] text-slate-400">TIN NO: 00142981-0-22</p>
                    </div>

                    {/* Bill Math parameters */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>MOCK COMMODITIES AMOUNT</span>
                        <span>ETB {basePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[10px]">Tax Class: {selectedTaxType} ({taxRatePercent}%)</span>
                        <span>ETB {calculatedTaxAmount.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-dashed border-slate-700 pt-2 flex justify-between font-bold text-white text-sm">
                        <span>GRAND TOTAL</span>
                        <span className="text-emerald-400 font-bold">ETB {grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* ERCA parameters code */}
                    <div className="border-t border-dashed border-slate-700 pt-4 flex flex-col items-center space-y-2 text-center text-[8.5px] text-slate-400">
                      <div className="w-16 h-16 bg-white p-1 rounded border border-slate-800 flex items-center justify-center">
                        <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`rounded-xs ${i % 3 === 0 || i % 5 === 1 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                          ))}
                        </div>
                      </div>
                      <p className="font-semibold select-none">** THANK YOU FOR YOUR COOPERATION **</p>
                      <p className="text-[8px] italic font-mono select-none">Processed offline via NextPOS browser sandbox</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SEC 2: Sync Blueprints */}
              {activeManualTab === 'offline' && (
                <div className="space-y-8 text-left">
                  <div className="max-w-2xl space-y-2">
                    <h3 className="text-xl font-bold font-display text-white flex items-center">
                      <RefreshCw className="w-5 h-5 mr-2 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                      Understanding Offline Syncing Logistics
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      We use an edge-first offline architecture. When you process checkouts inside NextPOS with Wi-Fi disabled, your device retains the data locally in IndexedDB without any interruption. Follow the pipeline:
                    </p>
                  </div>

                  {/* Vertical steps */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2 font-sans">
                    {workflows.map((step, index) => (
                      <div key={index} className="bg-[#1E293B]/40 p-5 rounded-xl border border-slate-800 relative space-y-2 text-left hover:border-slate-700 transition-colors">
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold font-mono shadow">
                          {index + 1}
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide pt-1 font-display">{step.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Educational info */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300 leading-normal font-sans">
                    <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-white">How are duplicate stock counts prevented upon syncing?</p>
                      <p>
                        Every transaction creates an unalterable timestamped UUID bundle from the mobile client. While offline, NextPOS immediately reduces the product's internal "Stock Balance counter" on the phone layout, so cashiers do not sell phantom items. Upon reconnection, stock allocations are reconciled against the global database sequentially.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SEC 3: Local Integration */}
              {activeManualTab === 'payments' && (
                <div className="space-y-6 text-left">
                  <div className="max-w-2xl space-y-2">
                    <h3 className="text-xl font-bold font-display text-white">Static QR Code checkout mechanisms</h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Because many clients transact via Telebirr or CBE Birr right at the register, NextPOS lets merchants store their secure phone merchant ID in the registers to display QR prompts directly on their screen:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 select-none text-white border border-slate-700">
                          A
                      </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Configure your profile</h4>
                          <p className="text-xs text-slate-400 leading-normal">Enter your Telebirr merchant ID or regular CBE bank phone number once in the POS options drawer.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 select-none text-white border border-slate-700">
                          B
                      </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Dynamic POS Display generation</h4>
                          <p className="text-xs text-slate-400 leading-normal">Upon checkout, NextPOS displays a dynamic printable billboard displaying the custom merchant address. Customers point their smartphone cameras and type the cost.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 select-none text-white border border-slate-700">
                          C
                      </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Verification Checklist</h4>
                          <p className="text-xs text-slate-400 leading-normal">Once the client receives their successful Telebirr notification, your clerk taps "Charge telebirr" to print their receipt and logs the reference number for cloud ledger indexing.</p>
                        </div>
                      </div>
                    </div>

                    {/* Display card visual */}
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-850 flex flex-col items-center text-center space-y-4">
                      <div className="w-full bg-[#111827] text-white p-3 rounded-lg text-[10px] font-mono flex justify-between items-center select-none border border-slate-800">
                        <span>Telebirr Quickpay QR</span>
                        <span className="text-emerald-400 font-bold">READY</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-800">
                        {/* Simulated Telebirr lookalike pixel QR */}
                        <div className="w-24 h-24 bg-teal-50 border border-teal-200 p-2 rounded-lg flex items-center justify-center">
                          <div className="grid grid-cols-5 gap-1 w-full h-full opacity-90">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <div key={i} className={`rounded-xs ${i % 2 === 0 && i % 3 === 0 ? 'bg-teal-700' : 'bg-transparent'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-slate-400 font-medium">Customers scan this, type the billing total in Birr, and show the teller the confirmation text.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
