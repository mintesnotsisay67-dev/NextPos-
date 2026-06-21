/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  WifiOff, 
  Smartphone, 
  TrendingUp, 
  Coins, 
  QrCode, 
  Database, 
  FileText, 
  ArrowRight, 
  Store, 
  Coffee, 
  CheckCircle, 
  Layers, 
  Sparkles,
  RefreshCw,
  Check,
  Zap,
  ShoppingBag,
  Cpu,
  ArrowDownToLine,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface LandingTabProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export default function LandingTab({ setActiveTab }: LandingTabProps) {
  const [selectedSector, setSelectedSector] = useState<'souq' | 'cafe' | 'boutique'>('souq');

  const downloadMockApk = () => {
    const content = `NextPOS Mobile Suite - Simulated Android Package (APK)
=====================================================
Package Name: et.nextpos.merchant.suite
Version: 2.4.3-beta-compliance
Build Signature: SHA256:7f99ee30ca24e645903bcf52e42023a1093bccef9023
Target SDK: API 34 (Android 14+)

NextPOS is certified to connect seamlessly with:
- 58mm & 80mm ESC/POS wireless thermal receipt printers
- Domestic payment registers (Telebirr, CBE Birr, Chapa)
- Dual online/offline ERCA tax compliance ledgers

This simulated bundle enables complete hardware feed tests on standard Android handheld systems.`;
    const blob = new Blob([content], { type: 'application/vnd.android.package-archive' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'NextPOS-v2.4.3-Simulator-Demo.apk');
    a.click();
  };

  // Interactive Live Phone Mockup States
  const [mockupCart, setMockupCart] = useState<Array<{ name: string; price: number; sku: string; qty: number; tax: string }>>([
    { name: 'Habesha Traditional Coffee', price: 320, sku: 'NP-042', qty: 1, tax: 'VAT 15%' },
    { name: 'Qolo Snack Mix', price: 45, sku: 'NP-001', qty: 2, tax: 'TOT 2%' },
  ]);
  const [mockupPayment, setMockupPayment] = useState<'telebirr' | 'cbe' | 'cash' | 'chapa'>('telebirr');
  const [isScanning, setIsScanning] = useState(false);
  const [scanningMessage, setScanningMessage] = useState<string | null>(null);
  const [scannedCount, setScannedCount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);

  // Pool of localized items that get automatically scanned
  const scanPool = [
    { name: 'Magna Teff (5kg Premium)', price: 720, sku: 'NP-101', tax: 'EXEMPT' },
    { name: 'Raw Shambu Forest Honey', price: 410, sku: 'NP-512', tax: 'TOT 2%' },
    { name: 'Organic Doro Wat Spice Mix', price: 185, sku: 'NP-023', tax: 'VAT 15%' },
    { name: 'Traditional Spiced Butter', price: 490, sku: 'NP-304', tax: 'TOT 2%' },
  ];

  // Simulated auto-scanning engine
  useEffect(() => {
    const scanInterval = setInterval(() => {
      // Don't auto-scan if already showing a receipt
      if (showReceipt) return;

      setIsScanning(true);
      setScanningMessage('Barcode scanning active...');

      // Complete scanning sequence with nice timeouts
      setTimeout(() => {
        setIsScanning(false);
        const nextItem = scanPool[scannedCount % scanPool.length];
        
        setMockupCart(prev => {
          const existing = prev.find(item => item.sku === nextItem.sku);
          if (existing) {
            return prev.map(item => item.sku === nextItem.sku ? { ...item, qty: item.qty + 1 } : item);
          } else {
            return [...prev, { ...nextItem, qty: 1 }];
          }
        });

        setScanningMessage(`Added: ${nextItem.name}`);
        setScannedCount(c => c + 1);

        // Dismiss toaster after 1.8s
        setTimeout(() => {
          setScanningMessage(null);
        }, 1800);

      }, 1200);

    }, 6000);

    return () => clearInterval(scanInterval);
  }, [scannedCount, showReceipt]);

  // Recalculate totals
  const subtotal = mockupCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.15; // Simulated weighted average tax rate
  const total = subtotal + tax;

  const handleSimulateScan = () => {
    if (isScanning || showReceipt) return;
    setIsScanning(true);
    setScanningMessage('Manual scan triggered...');
    setTimeout(() => {
      setIsScanning(false);
      const randomItem = scanPool[Math.floor(Math.random() * scanPool.length)];
      setMockupCart(prev => {
        const existing = prev.find(item => item.sku === randomItem.sku);
        if (existing) {
          return prev.map(item => item.sku === randomItem.sku ? { ...item, qty: item.qty + 1 } : item);
        } else {
          return [...prev, { ...randomItem, qty: 1 }];
        }
      });
      setScanningMessage(`Added: ${randomItem.name}`);
      setTimeout(() => setScanningMessage(null), 1800);
    }, 800);
  };

  const clearMockupCart = () => {
    setMockupCart([]);
    setShowReceipt(false);
  };

  const sectorConfigs = {
    souq: {
      title: 'Local Souqs & Minimarkets',
      icon: Store,
      tagline: 'Track hundreds of wholesale items (Teff, sugar, snacks) with offline barcodes.',
      highlights: ['Itemized inventory logs in kg & packs', 'Critical low stock reminders for swift ordering', 'Quick Cash or Telebirr billing buttons']
    },
    cafe: {
      title: 'Traditional Cafes & Restaurants',
      icon: Coffee,
      tagline: 'Speedy checkouts for coffee cups, pastries, and lunch orders with automated tables.',
      highlights: ['Instant ingredient deduction simulation', 'Split bills for friend groups', 'Localized VAT or TOT receipt layouts']
    },
    boutique: {
      title: 'Merkato Wholesalers & Boutiques',
      icon: Layers,
      tagline: 'High volume inventory tracking, VAT handling, and dual-currency conversion.',
      highlights: ['Automated 15% tax bracket computations', 'Store performance analytics by branch', 'Supplier cost monitoring and profit margin meters']
    }
  };

  const currentSector = sectorConfigs[selectedSector];

  // Motion variants for staggered entry elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#0F172A] text-slate-300">
      
      {/* Dynamic drifting background light overlays */}
      <motion.div 
        animate={{
          x: [0, 45, -30, 0],
          y: [0, -40, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] -z-10"
      />
      <motion.div 
        animate={{
          x: [0, -50, 35, 0],
          y: [0, 60, -40, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[140px] -z-10"
      />

      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pb-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Leftside: Hero Information Deck */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Animated Pill Status Header */}
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                100% OFFLINE-FIRST ARCHITECTURE
              </span>
            </motion.div>

            {/* Premium Header Typography */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.05] text-white tracking-tight"
            >
              Modernizing Ethiopian <br className="hidden sm:block"/>
              Retail with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-350 to-cyan-400">Next-Gen POS</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-slate-350 max-w-xl leading-relaxed font-sans"
            >
              Designed explicitly for local merchants from Merkato to Bole. An ultra-agile mobile checkout system featuring offline transaction buffering, localized VAT/TOT calculators, and direct payment pathways like Telebirr and CBE Birr.
            </motion.p>

            {/* Micro Stats Banner showing automated metrics */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 py-5 border-y border-slate-800/80 max-w-xl"
            >
              <div className="space-y-1">
                <span className="block text-3xl font-extrabold font-display text-emerald-400 tracking-tight">0 ms</span>
                <span className="text-xs text-slate-400 font-medium">Checkout Delay Offline</span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl font-extrabold font-display text-emerald-400 tracking-tight">Zero</span>
                <span className="text-xs text-slate-400 font-medium">Setup or Hardware Fee</span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl font-extrabold font-display text-cyan-400 tracking-tight">ERCA</span>
                <span className="text-xs text-slate-400 font-medium">Standard Compliance</span>
              </div>
            </motion.div>

            {/* High Impact Staggered CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                id="hero-primary-cta"
                onClick={() => setActiveTab('sandbox')}
                className="flex items-center justify-center px-7 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg hover:shadow-emerald-950/40 active:scale-[0.98] cursor-pointer group"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                id="hero-secondary-cta"
                onClick={() => setActiveTab('learning')}
                className="flex items-center justify-center px-7 py-4 rounded-2xl text-base font-semibold border border-slate-800 bg-slate-900/35 hover:bg-slate-800/40 hover:border-slate-700 text-slate-300 hover:text-white transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Read Local Tax Rules</span>
              </button>
            </motion.div>

            {/* Seamless Payment & System Badges */}
            <motion.div variants={itemVariants} className="pt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Supported Integrations</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/65 border border-slate-800 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-teal-300">Telebirr SuperApp</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/65 border border-slate-800 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-semibold text-blue-300">CBE Birr SDK</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/65 border border-slate-800 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-emerald-300">Chapa Checkout</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/65 border border-slate-800 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-xs font-semibold text-indigo-300">ERCA Recorders</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Rightside: Interactive Simulated Terminal Mockup */}
          <div className="lg:col-span-5 mt-14 lg:mt-0 relative flex justify-center">
            {/* Visual background rings decoration */}
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-full blur-2xl -z-10"></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="relative w-80 sm:w-85 h-[580px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800/90"
            >
              {/* Speaker notch & dynamic island */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-700/80 rounded-full"></div>
              </div>

              {/* Internal Screen mockup */}
              <div className="relative h-full w-full bg-[#0F172A] rounded-[36px] overflow-hidden flex flex-col pt-5 font-sans border border-slate-850">
                
                {/* Simulated Screen laser sweep bar during scans */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div 
                      initial={{ top: '10%' }}
                      animate={{ top: '85%' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: 'linear', repeat: Infinity }}
                      className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] z-30 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Simulated App Header */}
                <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-850 flex justify-between items-center z-10">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span className="font-extrabold text-[13px] tracking-tight text-white font-display">NextPOS</span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-emerald-500/20">DEMO_MOCK</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/10">BUFFER ACTIVE</span>
                  </div>
                </div>

                {/* Simulated Notification / Scan Toast */}
                <AnimatePresence>
                  {scanningMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-14 left-3 right-3 bg-emerald-950 border border-emerald-505 border-emerald-500/30 text-emerald-305 text-emerald-300 p-2 text-center rounded-xl text-[10px] font-mono z-30 shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                      <span className="font-bold">{scanningMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main app container inside screen */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto z-10 scrollbar-none">
                  
                  {/* Cart Summary Panel */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white p-3.5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Merchant Active Sale</span>
                      <button 
                        onClick={clearMockupCart}
                        className="text-[9px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                      >
                        Reset Cart
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-baseline">
                      <motion.span 
                        key={total}
                        initial={{ scale: 0.95, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-black font-mono tracking-tight text-white"
                      >
                        ETB {total.toFixed(2)}
                      </motion.span>
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-lg font-mono font-bold">
                        {mockupCart.reduce((s, i) => s + i.qty, 0)} Items
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Subtotal: {subtotal.toFixed(2)} Birr</span>
                      <span>VAT (15%): {tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Receipt Display Drawer */}
                  <AnimatePresence>
                    {showReceipt ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border text-slate-850 rounded-2xl p-4 font-mono text-[9px] text-slate-800 space-y-3 shadow-inner relative overflow-hidden"
                      >
                        {/* Cut lines */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 border-b-2 border-dashed border-slate-400"></div>
                        <div className="text-center pt-2">
                          <p className="font-bold text-[11px] tracking-tight uppercase">NextPOS Digital Receipt</p>
                          <p className="text-[8px] opacity-75">Bole High Road Branch • Addis Ababa</p>
                          <p className="text-[8px] opacity-75">Date: {new Date().toISOString().slice(0, 10)}</p>
                        </div>
                        <div className="border-y border-dashed border-slate-450 py-1.5 space-y-1">
                          {mockupCart.map((item, id) => (
                            <div key={id} className="flex justify-between font-mono">
                              <span className="truncate max-w-[130px] font-bold">{item.qty}x {item.name}</span>
                              <span className="shrink-0">{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-0.5 text-right font-mono font-bold">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>ETB {subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VAT 15%:</span>
                            <span>ETB {tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t border-dashed border-slate-400 pt-1 text-xs">
                            <span className="font-extrabold">TOTAL:</span>
                            <span className="font-extrabold text-slate-900">ETB {total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-500 font-normal">
                            <span>Paid Via:</span>
                            <span className="uppercase text-emerald-600 font-bold">{mockupPayment}</span>
                          </div>
                        </div>
                        <div className="text-center space-y-1.5 pt-2">
                          <p className="font-bold uppercase text-[8px] tracking-wider text-emerald-605 text-emerald-600">★ ERCA TAX APPROVED LEDGER ★</p>
                          <div className="w-1/2 h-4 bg-slate-350 mx-auto rounded flex items-center justify-center font-bold text-[7px] border tracking-wider">
                            ||||||||||||||||||
                          </div>
                          <button 
                            onClick={() => setShowReceipt(false)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] px-3 py-1 rounded-lg w-full transition-colors cursor-pointer leading-4"
                          >
                            Return to Checkout Drawer
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      // Cart Item List (Iterates and can dynamically add)
                      <div className="space-y-1.5 min-h-[140px]">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[9.5px] uppercase font-bold text-slate-400">Items in basket</span>
                          <span className="text-[8.5px] text-slate-500 font-mono">Real-time simulation loop</span>
                        </div>

                        {mockupCart.length === 0 ? (
                          <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                            <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                            <p className="text-xs text-slate-500 font-medium">Cart is empty</p>
                            <p className="text-[10px] text-slate-605 text-slate-400 mt-1">Wait 4s or trigger scan below</p>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {mockupCart.map((item, idx) => (
                              <motion.div 
                                key={`${item.sku}-${idx}`}
                                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center shadow-xs"
                              >
                                <div className="text-left">
                                  <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                                    {item.qty} pcs • {item.tax} • SKU: {item.sku}
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-emerald-400 bg-slate-850 px-2 py-1 rounded font-mono">
                                  {(item.price * item.qty).toFixed(0)} Birr
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Payment Simulator Panel */}
                  {!showReceipt && (
                    <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800/90 space-y-2">
                      <span className="text-[9.5px] uppercase font-bold text-slate-404 text-slate-400 block pb-1 border-b border-slate-800/80">Select Checkout Mode</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { key: 'telebirr', name: 'Telebirr', color: 'bg-teal-500', icon: QrCode },
                          { key: 'cbe', name: 'CBE Birr', color: 'bg-blue-600', icon: Coins },
                          { key: 'chapa', name: 'Chapa', color: 'bg-emerald-500', icon: Sparkles },
                          { key: 'cash', name: 'Cash', color: 'bg-slate-500', icon: FileText }
                        ].map((pay) => {
                          const IconComp = pay.icon;
                          const active = mockupPayment === pay.key;
                          return (
                            <button
                              key={pay.key}
                              onClick={() => setMockupPayment(pay.key as any)}
                              className={`p-1.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                                active 
                                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' 
                                  : 'border-slate-805 border-slate-800 text-slate-400 hover:bg-slate-800'
                              }`}
                            >
                              <IconComp className={`w-3.5 h-3.5 mb-1 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                              <span className="text-[8px] font-semibold tracking-tight">{pay.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* Simulated Screen Checkout Button Footer */}
                <div className="p-3 bg-slate-900 border-t border-slate-850 z-20">
                  {showReceipt ? (
                    <div className="w-full bg-slate-800 text-slate-300 rounded-xl py-2.5 flex items-center justify-center text-[11px] font-bold">
                      <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                      <span>Invoice Printed Successfully</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => mockupCart.length > 0 && setShowReceipt(true)}
                      disabled={mockupCart.length === 0}
                      className={`w-full text-white rounded-xl py-2.5 flex items-center justify-center text-xs font-bold gap-1.5 cursor-pointer shadow-md transition-all ${
                        mockupCart.length > 0 
                          ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98]' 
                          : 'bg-slate-800 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Print ERCA Invoice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Offline mode warning badge on device frame */}
              <div className="absolute -left-12 top-1/4 bg-slate-900 text-white px-3 py-2 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-2 -rotate-6">
                <WifiOff className="w-4 h-4 text-amber-500" />
                <div className="text-left font-mono">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-amber-400 leading-none">Offline Queue</p>
                  <p className="text-[7.5px] text-slate-350">Safely Storing Logs</p>
                </div>
              </div>

              {/* Scan controller badge on right side of device frame */}
              <button
                onClick={handleSimulateScan}
                className="absolute -right-14 bottom-1/4 bg-gradient-to-r from-teal-900 to-emerald-900 hover:from-teal-850 hover:to-emerald-850 text-white px-3 py-2 rounded-2xl border border-emerald-500/30 shadow-xl flex items-center space-x-1.5 rotate-6 cursor-pointer active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 leading-none">Tap Scan</p>
                  <p className="text-[7.5px] text-slate-300 font-mono">Trigger Item</p>
                </div>
              </button>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Feature Bento Grid */}
      <div className="bg-slate-900 text-white py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-base text-emerald-400 font-mono uppercase tracking-widest font-extrabold">The Ethiopian Retail Problem, Solved</h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
              Engineered for local market structures and high outages.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Most checkout terminals freeze up the minute WiFi drops or cellular signals fade. NextPOS caches transactions locally on your device and uploads them seamlessly when the network returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bento 1: Offline Engine */}
            <div className="bg-slate-850/80 border border-slate-800 rounded-3xl p-8 hover:border-slate-705 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">100% Offline-First Mode</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Add items to cart, charge customers, and generate receipt logs when there is absolutely no network access. Everything is buffered locally in your secure app cache.
              </p>
            </div>

            {/* Bento 2: Localized Tax Calculator */}
            <div className="bg-slate-850/80 border border-slate-800 rounded-3xl p-8 hover:border-slate-705 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">ERCA Localized Taxes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pre-configured for the Ethiopian Revenue Authority. Differentiates between standard 15% VAT, 2% Turn-over tax (TOT) for agricultural goods, 10% TOT services, and exempted staples instantly.
              </p>
            </div>

            {/* Bento 3: Local Payment Support */}
            <div className="bg-slate-850/80 border border-slate-800 rounded-3xl p-8 hover:border-slate-705 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">Telebirr & CBE Cashout</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empower your staff with standard fast cashout procedures that generate dynamic display codes for mobile payment verification, slashing checkout cues by up to 40%.
              </p>
            </div>

            {/* Bento 4: Real-time Analytics */}
            <div className="bg-slate-850/80 border border-slate-800 rounded-3xl p-8 hover:border-slate-705 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">Merchant Analytics in Birr</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Gain crystal clear insight into sales trends, average basket size, tax liabilities, and profit margins. Instantly monitor which products carry your shop through visual margin meters.
              </p>
            </div>

            {/* Bento 5: Private SQLite Stock Control */}
            <div className="bg-slate-850/80 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">Private Local SQLite Stocks</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your inventory lists, material cost limits, and stock alerts remain stored <span className="text-white font-bold">strictly on your physical device</span>. Zero cloud trackers scan your margins or private supplier rates.
              </p>
            </div>

            {/* Bento 6: Compliant Sales-Only Sync */}
            <div className="bg-slate-850/80 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">Compliant Sales-Only Sync</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Only transacted sales invoices are synced online to satisfy fiscal compliance registers. The underlying stock ledgers, costs, and customer directories stay completely off-grid.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Database Compliance Architecture Section */}
      <div className="py-20 bg-slate-950 border-t border-slate-850 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
              🔒 Merchant Safety & Trust Guarantee
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight text-white">
              Your Inventory Belongs to You. <br className="hidden sm:inline"/>Not the Government, Not the Cloud.
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              We understand the sensitive nature of retail storage, material margins, and supplier pricing in Ethiopia. NextPOS implements a strict <span className="text-emerald-400 font-bold">Dual-Storage Separation Architecture</span> to guarantee absolute operational privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Private Local SQLite Storage Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-amber-500/20">
                🔒 Strictly Local (Stored Offline Only)
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Database className="w-5 h-5" />
                  </span>
                  Local SQLite Phone Database
                </h3>
                <p className="text-xs text-slate-400">
                  All management assets remain localized in a encrypted sandbox directly on your Android/iOS terminal.
                </p>
              </div>

              <ul className="space-y-3.5 pt-2">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-500/30 text-rose-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✕</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Product Cost Matrix</p>
                    <p className="text-[11px] text-slate-400">Supplier costs and profit margins are never transmitted or parsed.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-500/30 text-rose-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✕</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Stock Count & Inventory Logs</p>
                    <p className="text-[11px] text-slate-400">Your total warehouse volumes remain private. No tax agency has API access to your stock.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-500/30 text-rose-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✕</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Supplier Contacts & Notes</p>
                    <p className="text-[11px] text-slate-400">Purchase orders and vendor listings stay classified within your local terminal cache.</p>
                  </div>
                </li>
              </ul>
              
              <div className="p-3 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-center">
                <p className="text-[10px] font-mono font-bold text-amber-400">
                  Status: OFFLINE-ONLY (Safe from Government Access)
                </p>
              </div>
            </div>

            {/* Middle Column: Interactive Architectural Bridge */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0 space-y-4">
              <div className="hidden lg:flex flex-col items-center space-y-2">
                <div className="w-1.5 h-12 bg-gradient-to-b from-amber-500 to-slate-800 rounded-full animate-pulse" />
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-[9px] font-mono text-slate-400 uppercase tracking-widest font-extrabold rotate-90 my-2">
                  Dual Gateway
                </span>
                <div className="w-1.5 h-12 bg-gradient-to-b from-slate-800 to-emerald-500 rounded-full animate-pulse" />
              </div>

              {/* Mobile flow connector line */}
              <div className="flex lg:hidden items-center justify-center space-x-2 w-full">
                <div className="h-1 flex-1 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" />
                <span className="text-[9px] font-mono uppercase bg-slate-900 border px-2 py-0.5 text-slate-400">Secure Protocol</span>
                <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" />
              </div>
            </div>

            {/* Right Column: Compliant Cloud Compliance Ledger */}
            <div className="lg:col-span-5 bg-slate-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/20">
                ⚡ Online Compliant (Sales Only)
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </span>
                  Compliance Transacted Sync Ledger
                </h3>
                <p className="text-xs text-slate-400">
                  Exclusively handles official transaction receipts to fulfill ERCA and payment integration pipelines.
                </p>
              </div>

              <ul className="space-y-3.5 pt-2">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">VAT (15%) & TOT Fiscal Calculations</p>
                    <p className="text-[11px] text-slate-400">Automated ledger of standard collected tax metrics to prevent billing audits.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Sequential Receipt Signature</p>
                    <p className="text-[11px] text-slate-400">Generates unique ID reference sequences compliant with ERCA physical ticket log models.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Telebirr & CBE Payment Verification</p>
                    <p className="text-[11px] text-slate-400">Direct instant handshakes with bank APIs to secure your merchant funds safely.</p>
                  </div>
                </li>
              </ul>

              <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center">
                <p className="text-[10px] font-mono font-bold text-emerald-400">
                  Status: COMPLIANT CRYPTO TUNNEL (Active Under 3G/LTE/WiFi)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local Tailored Sectors Showcase */}
      <div className="py-20 bg-[#0F172A] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            <div className="lg:col-span-12 xl:col-span-5 text-left space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-405 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                Agnostic Modular Configuration
              </span>
              <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
                Designed to Fit <span className="text-emerald-500">Every Corner</span> of Local Commerce
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Whether you manage a sprawling textile stall in Merkato, serve classic macchiatos in Bole, or retail staple grains down-market, NextPOS adjusts its workflow to your exact legal and pricing needs.
              </p>

              {/* Sector selector pills */}
              <div className="space-y-3 pt-2">
                <button
                  id="sector-tab-souq"
                  onClick={() => setSelectedSector('souq')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSector === 'souq'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg pr-4'
                      : 'border-slate-800 bg-slate-900/45 hover:bg-slate-800/40 text-slate-400 pr-4'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-slate-900 border ${selectedSector === 'souq' ? 'border-emerald-500/40 text-emerald-400' : 'border-slate-850 text-slate-450'}`}>
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Local Souqs & Provisions</p>
                      <p className="text-xs text-slate-400">Weight-based stock & Fast retail cashouts</p>
                    </div>
                  </div>
                  {selectedSector === 'souq' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                </button>

                <button
                  id="sector-tab-cafe"
                  onClick={() => setSelectedSector('cafe')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSector === 'cafe'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg pr-4'
                      : 'border-slate-800 bg-slate-900/45 hover:bg-slate-800/40 text-slate-400 pr-4'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-slate-900 border ${selectedSector === 'cafe' ? 'border-emerald-500/40 text-emerald-400' : 'border-slate-850 text-slate-450'}`}>
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Traditional Coffee & Cafes</p>
                      <p className="text-xs text-slate-400">Fast ticketing and tax receipting</p>
                    </div>
                  </div>
                  {selectedSector === 'cafe' && <CheckCircle className="w-5 h-5 text-emerald-400 text-emerald-400" />}
                </button>

                <button
                  id="sector-tab-boutique"
                  onClick={() => setSelectedSector('boutique')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSector === 'boutique'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg pr-4'
                      : 'border-slate-800 bg-slate-900/45 hover:bg-slate-800/40 text-slate-400 pr-4'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-slate-900 border ${selectedSector === 'boutique' ? 'border-emerald-500/40 text-emerald-400' : 'border-slate-850 text-slate-450'}`}>
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Merkato Wholesalers & Boutiques</p>
                      <p className="text-xs text-slate-400">VAT brackets and large inventory boards</p>
                    </div>
                  </div>
                  {selectedSector === 'boutique' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Dynamic Sector Specification Box */}
            <div className="lg:col-span-12 xl:col-span-7 mt-12 xl:mt-0">
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-left space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-6 right-6 flex items-center space-x-1 text-xs text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Optimized Preset</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-slate-800 border border-slate-700 shadow-2xs rounded-2xl flex items-center justify-center text-emerald-400">
                    <currentSector.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-display text-white">{currentSector.title}</h3>
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 mt-1">NextPOS Configuration Settings</p>
                  </div>
                </div>

                <p className="text-base text-slate-350 leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
                  "{currentSector.tagline}"
                </p>

                <div className="space-y-4 pt-2">
                  <p className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">Core Merchant Capabilities Included</p>
                  {currentSector.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    id="sector-demo-redirect-cta"
                    onClick={() => setActiveTab('sandbox')}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-sm shadow-md cursor-pointer"
                  >
                    <span>Test {currentSector.title} Workspace</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Apps & Sample APK Downloads Section */}
      <div className="py-20 bg-slate-950 border-t border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Download Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                Go Mobile & Handheld
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Run NextPOS on any <span className="text-emerald-500">Android & iOS</span> Terminal
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Connect physical smart POS systems, handheld bar-coding units, and standalone smartphones. Easily pair your merchant devices with 58mm/80mm Bluetooth printers, print invoices on-the-spot without complex PC setups, and handle customers anywhere on your store floor.
              </p>

              {/* Badges container */}
              <div className="flex flex-wrap gap-4 pt-2">
                {/* Google Play Store Button */}
                <a 
                  href="https://play.google.com/store" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-slate-905 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 px-5 py-3 rounded-2xl transition-all cursor-pointer group shadow"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-emerald-450 transition-colors group-hover:text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 5.25c0-.69.56-1.25 1.25-1.25H10L17.5 12 10 19.75H4.25c-.69 0-1.25-.56-1.25-1.25V5.25z" fillOpacity="0.15" />
                    <path d="M5 3.25a2.25 2.25 0 00-2.25 2.25v13a2.25 2.25 0 002.25 2.25h14a2.25 2.25 0 002.25-2.25v-13A2.25 2.25 0 0019 3.25H5zm0 1.5h14a.75.75 0 01.75.75v13a.75.75 0 01-.75.75H5a.75.75 0 01-.75-.75v-13a.75.75 0 01.75-.75z" />
                    <path d="M11.5 8.75l4 3.25-4 3.25V8.75z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-wider font-mono text-slate-500 font-bold">Download from</p>
                    <p className="text-sm font-bold font-display text-white group-hover:text-emerald-400 transition-colors">Google Play</p>
                  </div>
                </a>

                {/* Apple App Store Button */}
                <a 
                  href="https://www.apple.com/app-store" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-slate-905 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 px-5 py-3 rounded-2xl transition-all cursor-pointer group shadow"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-emerald-450 transition-colors group-hover:text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.92.99-3.03-1 .04-2.22.67-2.94 1.51-.62.73-1.16 1.87-1.01 2.97 1.12.09 2.27-.63 2.96-1.45" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-wider font-mono text-slate-500 font-bold">Download on the</p>
                    <p className="text-sm font-bold font-display text-white group-hover:text-emerald-400 transition-colors">App Store</p>
                  </div>
                </a>
              </div>

              {/* Direct APK Link Info */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-left">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Android Direct Implementation File (.apk)
                  </p>
                  <p className="text-xs text-slate-450 text-slate-400 mt-1">
                    Version 2.4.3 build with wireless thermal printing & standard offline sync modules.
                  </p>
                </div>
                <button
                  id="direct-apk-download-cta"
                  onClick={downloadMockApk}
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-md shadow-emerald-950/20 active:scale-95 border border-emerald-555 border-emerald-500/20"
                >
                  <ArrowDownToLine className="w-4 h-4 text-emerald-100" />
                  <span>Download Sample APK</span>
                </button>
              </div>
            </div>

            {/* Simulated Handheld Device Asset Representation */}
            <div className="lg:col-span-5 mt-12 lg:mt-0 flex justify-center">
              <div className="relative">
                {/* Tech card showcase design inside dashboard */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 opacity-20 blur-xl px-4" />
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-[280px] text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Smartphone className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-display">Scan to Get App Instantly</h4>
                  
                  {/* Styled simulated QR scanner */}
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center space-y-2">
                    <div className="bg-white p-1.5 rounded-lg">
                      <svg viewBox="0 0 100 100" className="w-28 h-28 bg-white">
                        {/* QR Corners */}
                        <rect x="5" y="5" width="25" height="25" fill="#0D172A" />
                        <rect x="10" y="10" width="15" height="15" fill="#FFFFFF" />
                        <rect x="13" y="13" width="9" height="9" fill="#0D172A" />
                        
                        <rect x="70" y="5" width="25" height="25" fill="#0D172A" />
                        <rect x="75" y="10" width="15" height="15" fill="#FFFFFF" />
                        <rect x="78" y="13" width="9" height="9" fill="#0D172A" />

                        <rect x="5" y="70" width="25" height="25" fill="#0D172A" />
                        <rect x="10" y="75" width="15" height="15" fill="#FFFFFF" />
                        <rect x="13" y="78" width="9" height="9" fill="#0D172A" />

                        {/* QR Pixels pattern */}
                        <path d="M 35 15 h 5 v 5 h -5 z M 45 5 h 10 v 5 h -10 z M 50 15 h 5 v 10 h -5 z M 35 30 h 10 v 5 h -10 z M 55 35 h 5 v 5 h -5 z M 75 45 h 10 v 5 h -10 z M 15 35 h 5 v 5 h -5 z M 5 45 h 10 v 5 h -10 z M 35 50 h 20 v 5 h -20 z M 65 65 h 5 v 15 h -5 z M 45 75 h 15 v 5 h -15 z M 80 80 h 15 v 15 h -15 z" fill="#0D172A" />
                        <path d="M 35 60 h 5 v 5 h -5 z M 45 65 h 5 v 5 h -5 z M 60 10 h 5 v 5 h -5 z M 65 25 h 5 v 10 h -5 z M 85 35 h 5 v 5 h -5 z" fill="#10B981" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-extrabold uppercase tracking-wide">NextPOS Setup Link</span>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Aim your native camera to download for your wireless smart cashier register model.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-slate-900 border-t border-slate-800 to-indigo-950/40 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Smartphone className="w-14 h-14 text-emerald-400 mx-auto animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
            Ready to modernize your shop checkout?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed text-sm">
            Take a 100% free test drive inside our simulated mobile pos terminal. See exactly how offline tracking queue preserves your sales logs in real-time.
          </p>
          <div>
            <button
              id="cta-footer-sandbox"
              onClick={() => setActiveTab('sandbox')}
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-base font-bold shadow-lg hover:shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Launch POS Sandbox Now</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
