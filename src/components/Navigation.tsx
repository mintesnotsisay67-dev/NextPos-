/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Menu, X, Terminal, ArrowRight, Layers, LogIn, ChevronRight, Check } from 'lucide-react';

interface NavigationProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isOffline: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navigation({ activeTab, setActiveTab, isOffline, theme, toggleTheme }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'landing' as NavigationTab, label: 'Home' },
    { id: 'learning' as NavigationTab, label: 'Learning Hub' },
    { id: 'about' as NavigationTab, label: 'About' },
    { id: 'pricing' as NavigationTab, label: 'Pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button 
              id="logo-brand-button"
              onClick={() => setActiveTab('landing')} 
              className="flex items-center cursor-pointer group"
            >
              <span className="text-2xl font-extrabold tracking-tight font-display text-white leading-none">
                Next<span className="text-emerald-500">POS</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-slate-350 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Offline/Online Status Pill Indicator */}
            <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-mono font-medium border mr-2 transition-all duration-300 ${
              isOffline 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              {isOffline ? 'Offline Mode (Local Buffer)' : 'Cloud Synchronized'}
            </div>

            {/* CTA to get into sandbox terminal */}
            <button
              id="cta-sandbox-nav"
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-500 glow-green'
                  : 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-lg'
              }`}
            >
              <Terminal className="w-4 h-4 mr-2" />
              <span>Interactive Demo</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <div className={`flex items-center px-2 py-1 rounded-full text-[10px] font-mono border ${
              isOffline 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              {isOffline ? 'Offline' : 'Online'}
            </div>

            <button
              id="mobile-menu-trigger"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 shadow-inner animate-in fade-in slide-in-from-top duration-200">
          {menuItems.map((item) => (
            <button
              key={item.id}
              id={`nav-mob-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                activeTab === item.id
                  ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 mt-2">
            <button
              id="cta-sandbox-mob"
              onClick={() => {
                setActiveTab('sandbox');
                setIsOpen(false);
              }}
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow-md active:scale-95 transition-all text-center"
            >
              <Terminal className="w-4 h-4 mr-2" />
              <span>Launch Demo Terminal</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
