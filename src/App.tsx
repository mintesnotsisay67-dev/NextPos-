/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab } from './types';
import Navigation from './components/Navigation';
import LandingTab from './components/LandingTab';
import PricingTab from './components/PricingTab';
import AboutTab from './components/AboutTab';
import LearningTab from './components/LearningTab';
import DashboardDemo from './components/DashboardDemo';
import { HelpCircle, Sparkles, MessageCircle, FileText, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab ] = useState<NavigationTab>('landing');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nextpos_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('nextpos_theme', newTheme);
  };

  return (
    <div className={`min-h-screen ${theme} flex flex-col font-sans transition-all duration-300`}>
      
      {/* Dynamic Header & Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOffline={isOffline} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Tab Render Space */}
      <main className="flex-1 overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full h-full"
          >
            {activeTab === 'landing' && (
              <LandingTab setActiveTab={setActiveTab} />
            )}
            {activeTab === 'pricing' && (
              <PricingTab setActiveTab={setActiveTab} />
            )}
            {activeTab === 'about' && (
              <AboutTab setActiveTab={setActiveTab} />
            )}
            {activeTab === 'learning' && (
              <LearningTab />
            )}
            {activeTab === 'sandbox' && (
              <DashboardDemo 
                isOffline={isOffline} 
                setIsOffline={setIsOffline} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer block - Elegant, minimalist, and contextualized */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-12 text-left font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo/Identity description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold font-display tracking-tight text-white">
                  Next<span className="text-emerald-500">POS</span>
                </span>
                <span className="bg-emerald-950 text-emerald-400 text-[8px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider border border-emerald-900">
                  EST. 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart checkout software engineered specifically for domestic local markets in Ethiopia. Built with secure client cache databases and 100% offline checkout state resilience.
              </p>
              <div className="flex space-x-3 text-slate-500 font-mono text-[9px] font-bold">
                <span>BOLE DISTRICT, ADDIS ABABA</span>
              </div>
            </div>

            {/* Links columns - Quick navigation redirects */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400">POS Core Solutions</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button 
                    id="foot-nav-pos"
                    onClick={() => { setActiveTab('sandbox'); }} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Interactive Desk Registers
                  </button>
                </li>
                <li>
                  <button 
                    id="foot-nav-how-it-works"
                    onClick={() => { setActiveTab('learning'); }} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Localized ERCA VAT Handouts
                  </button>
                </li>
                <li>
                  <button 
                    id="foot-nav-pricing"
                    onClick={() => { setActiveTab('pricing'); }} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Birr (ETB) Subscription Tiers
                  </button>
                </li>
              </ul>
            </div>

            {/* Local market specific legal details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400">Localized Compatibility</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                NextPOS adheres to standard trade regulations outlined by the Ministry of Revenue and the Ethiopian Revenue Authority (ERCA). Standard computations are simulated only.
              </p>
            </div>

            {/* Simple Contact detail mock */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400">Direct Support Channels</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <p className="flex items-center">
                  <PhoneCall className="w-3.5 h-3.5 mr-2 text-emerald-400 shrink-0" />
                  <span>+251965307585 (Addis HQ)</span>
                </p>
                <p className="flex items-center">
                  <MessageCircle className="w-3.5 h-3.5 mr-2 text-blue-400 shrink-0" />
                  <span>t.me/nextpos1</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Supported billing integrations: telebirr, chapa, cbe birr
                </p>
              </div>
            </div>

          </div>

          {/* Underbar footer */}
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 NextPOS. Handcrafted for Ethiopian Retail & Provision Merchants.</p>
            <div className="flex space-x-4">
              <span className="hover:text-white transition-all select-none">T & C</span>
              <span className="hover:text-white transition-all select-none">Privacy Charter</span>
              <span className="hover:text-white transition-all select-none">ERCA Presets v2.4</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
