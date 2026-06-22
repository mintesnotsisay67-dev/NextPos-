/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { Check, HelpCircle, ArrowRight, Coins, MessageSquare, ShieldCheck, Minimize2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingTabProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export default function PricingTab({ setActiveTab }: PricingTabProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tiers = [
    {
      name: 'Simulated Starter',
      description: 'Perfect for micro-souqs, roadside stands, and start-up kiosks with 500 monthly simulated tx.',
      priceMonthly: 800,
      priceYearly: 667,
      priceYearlyTotal: 8000,
      badge: 'Micro-Merchants',
      features: [
        'Single device POS checkout',
        '500 monthly transactions simulated',
        'Basic Turn-Over Tax (2% TOT Goods) auto-calculation',
        'Daily sales sum tracker',
        'Local browser storage persistence',
        'Standard receipt view simulator'
      ],
      cta: 'Start with Starter Simulator',
      tabValue: 'sandbox' as NavigationTab,
      popular: false
    },
    {
      name: 'Growth Outlet',
      description: 'Ideal for busy cafes, clothing boutiques, and Bole pharmacies.',
      priceMonthly: 2500,
      priceYearly: 1875, // equivalent monthly for 22,500/yr
      priceYearlyTotal: 22500,
      badge: 'Merchant Standard',
      features: [
        'Up to 3 synchronized mobile terminals',
        'Unlimited offline transaction buffers & background auto-sync',
        'Full ERCA compliance presets (VAT 15%, TOT 2% & 10%)',
        'Localized Inventory warning logs & low stock alerts',
        'Direct cashout QR configurations (Telebirr, CBE Birr)',
        'Comprehensive monthly sales & profit tax reporting',
        'Cloud backups in under 3 seconds on sync reconnection'
      ],
      cta: 'Try Premium Simulator',
      tabValue: 'sandbox' as NavigationTab,
      popular: true
    },
    {
      name: 'Merkato Wholesale',
      description: 'Built for high-volume traders, distributors, and multi-store operations.',
      priceMonthly: 3200,
      priceYearly: 2500, // equivalent monthly for 30,000/yr
      priceYearlyTotal: 30000,
      badge: 'Enterprise Bulk',
      features: [
        'Unlimited registers, stores, and active users',
        'Raw CSV database dumps fully formatted for ERCA audit uploads',
        'Advanced sub-stock tracking in metric tons or custom bulk packs',
        'Supplier debt manager and credit accounts tracking',
        'Custom invoice header branding & physical thermal printer API',
        'Dedicated 24/7 Telegram & direct-phone local engineer support',
        'Custom integration hooks for local ERPs'
      ],
      cta: 'Explore Wholesale Workspace',
      tabValue: 'sandbox' as NavigationTab,
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'Does NextPOS require an active internet connection to process sales?',
      a: 'Absolutely not. NextPOS allows physical sales processing, inventory deductions, and ticket creation with zero network signal. Everything aggregates securely in a local device queue and updates the cloud automatically the moment you return to a connected area.'
    },
    {
      q: 'How does the automated taxation system comply with ERCA requirements?',
      a: 'We have pre-programmed taxation presets standard in Ethiopia: 15% VAT for standard VATregistered enterprises, 2% Turn-over Tax (TOT) for commodity trade transactions below registration thresholds, and 10% TOT for specialized services. You can easily tag categories to automate VAT or TOT inclusion at checkout.'
    },
    {
      q: 'Can I connect a physical mobile receipt printer to NextPOS?',
      a: 'Yes. In the production app, NextPOS connects seamlessly to standard Bluetooth or Wi-Fi 58mm & 80mm thermal receipt printers compliant with local invoice formats, allowing merchants to print paper receipts immediately.'
    },
    {
      q: 'What local integration portals do you offer for payment setups?',
      a: 'We support static digital display QR configurations for major agencies: CBE Birr, Telebirr, and direct Web Checkout gateways like Chapa. NextPOS is built to streamline phone payments for customers directly inside the physical shop.'
    }
  ];

  return (
    <div className="py-12 relative min-h-screen bg-[#0F172A] text-slate-300">
      {/* Visual Accent */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Header Block */}
        <div className="space-y-4 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold">
            <Coins className="w-4 h-4 mr-1 text-emerald-405 text-emerald-405 text-emerald-400" />
            <span>Fair, Transparent Local Rates</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight text-white tracking-tight">
            Plans Denominated in <span className="text-emerald-500">Ethiopian Birr</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            No foreign exchange bottlenecks. Simple subscription pricing designed to match the realistic cost structures of diverse local retail outlets.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center justify-center p-1 bg-slate-900 border border-slate-800 rounded-xl mt-6">
            <button
              id="billing-cycle-monthly"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              id="billing-cycle-yearly"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all relative flex items-center space-x-1 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly Saver</span>
              <span className="bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-extrabold block">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Matrix Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-6 text-left">
          {tiers.map((tier, index) => {
            const price = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.12, type: "spring", stiffness: 85, damping: 14 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`flex flex-col bg-slate-900/60 rounded-3xl p-8 border transition-all duration-300 relative ${
                  tier.popular
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xl bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Popularity Badge */}
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Most Popular Choice
                  </span>
                )}

                {/* Card Top Details */}
                <div className="space-y-3 mb-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-slate-350 bg-slate-800 px-2 py-0.5 rounded">
                    {tier.badge}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-400 leading-normal min-h-12">
                    {tier.description}
                  </p>
                </div>

                {/* Pricing Core Meter */}
                <div className="border-b border-slate-800 pb-6 mb-6">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-mono font-bold text-slate-400 leading-none">ETB</span>
                    <span className="text-4xl sm:text-5xl font-extrabold font-display text-white leading-none">
                      {price === 0 ? '0' : price.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-slate-400">/ month</span>
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <div className="mt-1.5 space-y-0.5 font-mono">
                      <p className="text-[11px] text-emerald-400 font-bold">
                        Billed annually: ETB {tier.priceYearlyTotal.toLocaleString()}/yr
                      </p>
                      <p className="text-[10px] text-emerald-500/80 font-medium">
                        (Save ETB {((tier.priceMonthly * 12) - tier.priceYearlyTotal).toLocaleString()}/year)
                      </p>
                    </div>
                  )}
                  {price === 0 && (
                    <p className="text-[10.5px] text-slate-400 font-semibold mt-1">
                      No cards or billing setup required.
                    </p>
                  )}
                </div>

                {/* Feature checklist */}
                <div className="flex-1 space-y-3.5 mb-8">
                  <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">What is Included</p>
                  {tier.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start space-x-2.5">
                      <div className="mt-0.5 w-4.5 h-4.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-slate-300 font-medium leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <button
                  id={`cta-tier-${index}`}
                  onClick={() => setActiveTab(tier.tabValue)}
                  className={`w-full py-3.5 rounded-xl text-center text-xs font-bold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    tier.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-850 hover:bg-slate-800 text-white border border-slate-750'
                  }`}
                >
                  {tier.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Local Support Banner */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between text-left gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center">
              <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-400" />
              Need custom enterprise scales or payment options?
            </h4>
            <p className="text-xs text-slate-400">
              We provide custom builds incorporating local bank gateways (Ahadu, Coop, Zemen) and physical integration support.
            </p>
          </div>
          <button
            id="cta-pricing-about-redirect"
            onClick={() => setActiveTab('about')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 rounded-lg shadow whitespace-nowrap transition-all cursor-pointer"
          >
            Read Our Scope
          </button>
        </div>

        {/* FAQ Section */}
        <div className="pt-16 max-w-4xl mx-auto text-left space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-display text-white">Subscription FAQs</h2>
            <p className="text-xs sm:text-sm text-slate-400">Clear answers for business owners regarding deployment, hardware, and offline sync.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-start">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 mr-2 shrink-0"></span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-4">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
