/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationTab } from '../types';
import { 
  Users, 
  MapPin, 
  CheckCircle, 
  Building2, 
  HeartHandshake, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'motion/react';

interface AboutTabProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export default function AboutTab({ setActiveTab }: AboutTabProps) {
  const stats = [
    { value: '100%', label: 'Local Birr Denomination' },
    { value: '0 ms', label: 'Incidental Offline Cache Holdup' },
    { value: 'VAT/TOT', label: 'Preset Local Tax Automation' },
    { value: '1-Click', label: 'Simulated Receipt Issuing' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="py-12 relative min-h-screen text-left bg-[#0F172A] text-slate-300">
      {/* Visual Accents */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16"
      >
        
        {/* Core Vision Banner */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="inline-flex items-center space-x-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
            <Building2 className="w-4 h-4 mr-1 text-blue-400" />
            <span>Empowering Local Retail Commerce</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-[1.12] text-white tracking-tight">
            Our Mission: Re-engineering POS Systems for <span className="text-emerald-400">Ethiopian Growth</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl">
            At NextPOS, we believe commerce shouldn't pause when connection drops. Local markets—from the historic wholesale alleys of Merkato to the modern retail storefronts of Bole—face constant structural challenges with unreliable cellular routing, recurrent electrical outages, and complex multi-layered tax classifications. 
          </p>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-4xl">
            Generic POS tools imported from Europe or the US are built for constant gigabit connections and foreign card ecosystems (Visa, Stripe). They break, freeze, or reject local checkout setups during standard downtime. NextPOS was built from scratch to preserve local transactions during outages, allowing merchants to confidently ring up traditional coffee kg boxes, grain sacks, apparel, or snacks—and automatically synchronize reports the second coverage returns.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800"
        >
          {stats.map((stat, sIdx) => (
            <motion.div 
              key={sIdx} 
              whileHover={{ scale: 1.03 }}
              className="space-y-2 text-center md:text-left border-r border-slate-800 last:border-0 pr-4"
            >
              <span className="block text-2xl sm:text-3.5xl font-extrabold font-display text-emerald-400 animate-pulse">
                {stat.value}
              </span>
              <span className="block text-[11px] sm:text-xs text-slate-450 font-mono tracking-wider uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Principles */}
        <div className="space-y-8">
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Our Foundation Pillars
          </motion.h2>

          <motion.div 
            variants={cardContainerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: '#10b981' }}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xs space-y-4 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Localized Context</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We design our system interfaces around real-world local business styles. From wholesale grain weights (kg/bags) to traditional clothing and provisions, our inventory supports custom naming, measurements, and native pricing models.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: '#10b981' }}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xs space-y-4 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Automated Tax Accuracy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                National business operators must submit structured tax registers to the ERCA. We bake standard 15% VAT, 2% commodity Turn-over Tax, 10% services Turn-over tax, and duty exemption algorithms right into the core checkout transaction pipeline.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: '#10b981' }}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xs space-y-4 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20" style={{ animationDuration: '3s' }}>
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Engineering Autonomy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                NextPOS implements indexed internal databases built directly into the mobile browser and native app. Transactions remain active even if the device has not seen signal for five consecutive days.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Localized Impact Story */}
        <motion.div 
          variants={itemVariants} 
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-start gap-6 font-sans">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-bold font-display text-white">From Bole to Merkato: Real Local Influence</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                NextPOS began with a simple question: "Why do local cashiers still rely on manual pencil-and-paper ledgers alongside 250,000 Birr physical cash registers that lock up constantly?" In high-traffic districts, time is literally money. Slow queues lose business. Our local team realized that standardizing offline billing on standard tablets and smartphones could double checkout throughput.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                By enabling smart, visual product blocks and automating the distinct tax brackets required for diverse Ethiopian entities, NextPOS eliminates human addition mistakes and simplifies bookkeeping for the tax season, protecting merchants from arbitrary audits.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="pb-8 text-center space-y-4">
          <p className="text-sm text-slate-400">Want to see the system's local tax processing and offline cache queue in action?</p>
          <button
            id="cta-about-sandbox"
            onClick={() => setActiveTab('sandbox')}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transform active:scale-95 transition-all shadow-lg hover:shadow-emerald-900/10 cursor-pointer"
          >
            <span>Launch POS Sandbox Terminal</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
