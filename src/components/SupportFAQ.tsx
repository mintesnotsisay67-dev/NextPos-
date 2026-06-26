/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  WifiOff, 
  Receipt, 
  ShieldCheck, 
  HelpCircle, 
  Search,
  BookOpen
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'offline' | 'taxes';
}

export default function SupportFAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'offline' | 'taxes'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'offline-1',
      category: 'offline',
      question: 'Can I use NextPOS when the internet is completely down in Addis or remote regions?',
      answer: 'Absolutely. NextPOS uses a robust localized cache (built directly on-device) that keeps all POS checkout interfaces fully active. You can search products, modify cart quantities, apply custom discounts, and issue simulated receipts without any active connection. Everything is sequentially queued and automatically synchronized the moment your terminal catches a 3G/LTE/WiFi signal.'
    },
    {
      id: 'offline-2',
      category: 'offline',
      question: 'How do simulated receipts work while working offline?',
      answer: 'When a checkout is finalized in offline mode, NextPOS generates an internal sequential receipt reference number and appends a cryptographic hash signature locally. The sale is then pushed into the offline sync queue. Even if the device remains completely off-grid for days, the terminal preserves the correct invoice sequence and chronological logs.'
    },
    {
      id: 'offline-3',
      category: 'offline',
      question: 'Will I lose my sales data if my phone battery dies or the browser resets while offline?',
      answer: 'No. Unlike basic web calculators, NextPOS persists active sales lists and the transaction queue inside the secure physical storage sandbox of your device. Standard page reloads, temporary battery loss, or closing the tab will not clear your pending transactions.'
    },
    {
      id: 'taxes-1',
      category: 'taxes',
      question: 'What Ethiopian tax structures are pre-configured in NextPOS?',
      answer: 'NextPOS comes pre-loaded with standard national tax structures compliant with Ethiopian revenue frameworks. This includes standard 15% VAT (Value Added Tax), 2% Turn-Over Tax (TOT) for commercial merchandise and goods, and 10% Turn-Over Tax (TOT) for consulting or service setups. You can toggle these presets or configure dual-tax scenarios during checkout with a single tap.'
    },
    {
      id: 'taxes-2',
      category: 'taxes',
      question: 'Can I handle tax-exempt items alongside taxable items in the same checkout transaction?',
      answer: 'Yes. Every item in your NextPOS sandbox inventory can be customized with its own distinct tax behavior (VAT, TOT, or fully Tax-Exempt). When checking out a mixed basket of goods—such as standard packaged products alongside duty-exempt raw teff or wheat grains—the system automatically divides the calculation and updates the simulated receipt with split tax ledgers.'
    },
    {
      id: 'taxes-3',
      category: 'taxes',
      question: 'Is my private inventory cost margin data shared during compliance synchronization?',
      answer: 'Never. NextPOS enforces a strict Dual-Storage Separation Architecture. Your cost prices, purchase logs, supplier contacts, and warehouse stock levels are stored strictly inside your localized device database. Only finalized outward sales invoices (VAT, total transaction volume, transaction dates) are synced online for compliance and payment handshakes. Your private supplier relationships and internal profit margins remain 100% confidential.'
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Visual background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Support Knowledge Base</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              NextPOS Operations FAQ
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Got questions about local VAT/TOT calculations, offline receipt security, or SQLite on-device data isolation? Find instant answers below.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search offline or tax topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-850 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 border-b border-slate-850 pb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-850'
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setActiveCategory('offline')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'offline'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-850'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            Offline Capabilities
          </button>
          <button
            onClick={() => setActiveCategory('taxes')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'taxes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-850'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Tax & Compliance Settings
          </button>
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <div
                    key={faq.id}
                    id={`faq-item-${faq.id}`}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 text-left ${
                      isExpanded
                        ? 'bg-slate-950 border-emerald-500/30 shadow-lg'
                        : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-5 py-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-950/80 transition-all text-left"
                    >
                      <div className="flex gap-3 items-start">
                        <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          faq.category === 'offline' 
                            ? 'bg-blue-500/10 text-blue-400' 
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {faq.category === 'offline' ? (
                            <WifiOff className="w-4 h-4" />
                          ) : (
                            <Receipt className="w-4 h-4" />
                          )}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-relaxed pt-0.5">
                          {faq.question}
                        </h4>
                      </div>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-slate-400 hover:text-white shrink-0 mt-1"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-5 pt-1 pl-14 text-xs text-slate-400 leading-relaxed border-t border-slate-900/40">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-slate-500 text-xs font-mono"
              >
                No matching questions found. Try searching with other terms.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic footer help note */}
        <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Still have custom setup questions?</p>
              <p className="text-[11px] text-slate-500">Reach our direct agent helpline in Addis Ababa on Telegram.</p>
            </div>
          </div>
          <a
            href="https://t.me/nextpos1"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-white font-mono font-bold text-center transition-all cursor-pointer shrink-0"
          >
            t.me/nextpos1
          </a>
        </div>
      </div>
    </div>
  );
}
