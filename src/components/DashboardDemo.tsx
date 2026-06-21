/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, TaxConfig, SyncLog } from '../types';
import { EthiopianTaxDefaults, InitialProducts, HistoricalOrders } from '../mockData';
import { 
  Wifi, 
  WifiOff, 
  ShoppingCart, 
  Trash2, 
  FileText, 
  TrendingUp, 
  Coins, 
  Boxes, 
  Plus, 
  Minus, 
  CheckCircle, 
  RefreshCw, 
  AlertTriangle, 
  ArrowDownToLine, 
  QrCode, 
  Search, 
  Filter, 
  ChevronRight,
  Database,
  Printer,
  X,
  CreditCard,
  DollarSign
} from 'lucide-react';

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid 
} from 'recharts';

import { motion, AnimatePresence } from 'motion/react';

// Helper to generate guaranteed unique IDs in strict mode / hot loads
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

interface DashboardDemoProps {
  isOffline: boolean;
  setIsOffline: (status: boolean) => void;
}

export default function DashboardDemo({ isOffline, setIsOffline }: DashboardDemoProps) {
  // Master states
  const [products, setProducts] = useState<Product[]>(InitialProducts);
  const [orders, setOrders] = useState<Order[]>(() => {
    // Dynamically adjust HistoricalOrders to be within the last 7 days of Today for beautiful visualization
    const now = new Date();
    return HistoricalOrders.map((order, idx) => {
      const d = new Date();
      // Map ord-1 to yesterday, ord-2 to 3 days ago, ord-3 to 5 days ago
      if (order.id === 'ord-1') {
        d.setDate(now.getDate() - 1);
      } else if (order.id === 'ord-2') {
        d.setDate(now.getDate() - 3);
      } else {
        d.setDate(now.getDate() - 5);
      }
      return {
        ...order,
        timestamp: d.toISOString()
      };
    });
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'Fetch Initial Stock',
      status: 'synced',
      details: 'Retrieved 10 localized product inventories from cloud container.'
    }
  ]);

  // UI Filter states
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubView, setActiveSubView] = useState<'pos' | 'analytics' | 'inventory' | 'sales'>('pos');

  // Interactive transaction states
  const [checkoutNotes, setCheckoutNotes] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<'Cash' | 'Telebirr' | 'CBE Birr' | 'Chapa' | 'Card'>('Telebirr');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Thermal Printer Simulator States
  const [selectedPrinterWidth, setSelectedPrinterWidth] = useState<'80mm' | '58mm'>('80mm');
  const [showEscPosBytes, setShowEscPosBytes] = useState<boolean>(false);
  const [isSimulatingFeed, setIsSimulatingFeed] = useState<boolean>(false);
  const [feedProgress, setFeedProgress] = useState<number>(0);
  const [selectedVerifyMethod, setSelectedVerifyMethod] = useState<'telebirr' | 'cbe' | 'erca'>('telebirr');

  // Custom Product Form state
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductCategory, setNewProductCategory] = useState<string>('Grains & Snacks');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [newProductCost, setNewProductCost] = useState<string>('');
  const [newProductStock, setNewProductStock] = useState<string>('50');
  const [newProductUnit, setNewProductUnit] = useState<string>('kg');
  const [newProductTaxType, setNewProductTaxType] = useState<'VAT' | 'TOT_2' | 'TOT_10' | 'EXEMPT'>('VAT');

  // Barcode Scanner Simulation state
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [scanSku, setScanSku] = useState<string>('');
  const [scanError, setScanError] = useState<string>('');

  // Group all currently active orders into the physical last 7 calendar days leading up to today
  const getLast7DaysSalesData = () => {
    const daysData = [];
    const now = new Date();
    
    // Create the last 7 days in chronological order (from 6 days ago up to today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
      daysData.push({
        dateStr: d.toISOString().split('T')[0], // "YYYY-MM-DD"
        name: `${dayLabel} ${dateLabel}`,       // e.g. "Wed 6/3"
        sales: 0,
        txCount: 0
      });
    }

    orders.forEach(order => {
      const dateStr = new Date(order.timestamp).toISOString().split('T')[0];
      const matchingDay = daysData.find(d => d.dateStr === dateStr);
      if (matchingDay) {
        matchingDay.sales = parseFloat((matchingDay.sales + order.total).toFixed(2));
        matchingDay.txCount += 1;
      }
    });

    return daysData;
  };

  const weeklySalesData = getLast7DaysSalesData();

  // Trigger sync animation when toggling online
  useEffect(() => {
    if (!isOffline) {
      setSyncing(true);
      const pendingOrdersCount = orders.filter(o => !o.isSynced).length;
      
      const timer = setTimeout(() => {
        setSyncing(false);
        if (pendingOrdersCount > 0) {
          // Sync all pending orders
          setOrders(prev => prev.map(o => ({ ...o, isSynced: true })));
          
          // Log synchronization
          setSyncLogs(prev => [
            {
              id: generateId('log'),
              timestamp: new Date().toISOString(),
              action: 'Sync Local Cache',
              status: 'synced',
              details: `Synchronized ${pendingOrdersCount} offline sale records. Merged inventories.`
            },
            ...prev
          ]);
        }
      }, 1500); // simulate sync delay
      
      return () => clearTimeout(timer);
    } else {
      setSyncLogs(prev => [
        {
          id: generateId('log'),
          timestamp: new Date().toISOString(),
          action: 'Go Offline',
          status: 'pending',
          details: 'Standard internet network disconnected. NextPOS has successfully switched to local buffer mode.'
        },
        ...prev
      ]);
    }
  }, [isOffline]);

  // Handle thermal print feed simulation timer when receipt modal is active
  useEffect(() => {
    if (isReceiptModalOpen) {
      setIsSimulatingFeed(true);
      setFeedProgress(0);
      const interval = setInterval(() => {
        setFeedProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSimulatingFeed(false);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isReceiptModalOpen, selectedPrinterWidth]);

  // Categories list
  const categories = ['All', 'Grains & Snacks', 'Prepared Food & Drinks', 'Apparel & Crafts'];

  // Add Item to POS Cart
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(`Oops! ${product.name} is currently out of stock. Please restock it in the Inventory section first.`);
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Cart quantity matches maximum safe stock limits on hand (${product.stock} ${product.unit}).`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Adjust quantity from cart
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          // check stock limit
          if (newQty > item.product.stock) {
            alert(`Stock limits reached (${item.product.stock} available).`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  // Clear single cart item
  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Tax calculation helper by product tax classification
  const calculateCartTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;

    cart.forEach(item => {
      const itemSubtotal = item.product.price * item.quantity;
      subtotal += itemSubtotal;

      let taxPercentage = 0;
      if (item.product.taxType === 'VAT') {
        taxPercentage = EthiopianTaxDefaults.vatPercentage; // 15%
      } else if (item.product.taxType === 'TOT_2') {
        taxPercentage = EthiopianTaxDefaults.totGoodsPercentage; // 2%
      } else if (item.product.taxType === 'TOT_10') {
        taxPercentage = EthiopianTaxDefaults.totServicesPercentage; // 10%
      }

      taxAmount += (itemSubtotal * taxPercentage) / 100;
    });

    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const { subtotal, taxAmount, total } = calculateCartTotals();

  // Handle transaction checkout
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart terminal is empty! Add products first.');
      return;
    }

    // Deduct stock levels locally
    const updatedProducts = products.map(prod => {
      const cartMatch = cart.find(item => item.product.id === prod.id);
      if (cartMatch) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - cartMatch.quantity)
        };
      }
      return prod;
    });

    setProducts(updatedProducts);

    // Create unique invoice id
    const invoiceNo = `NP-2026-0${490 + orders.length + 1}`;
    const newOrder: Order = {
      id: generateId('ord'),
      invoiceNo,
      timestamp: new Date().toISOString(),
      items: [...cart],
      subtotal,
      taxAmount,
      total,
      paymentMethod: selectedPayment,
      isSynced: !isOffline,
      notes: checkoutNotes || undefined
    };

    // Prepend new simulation order
    setOrders(prev => [newOrder, ...prev]);

    // Track Synchronization logs
    setSyncLogs(prev => [
      {
        id: generateId('log'),
        timestamp: new Date().toISOString(),
        action: isOffline ? 'Queue Offline Sale' : 'Cloud Direct Sale',
        status: isOffline ? 'pending' : 'synced',
        details: isOffline 
          ? `Invoice ${invoiceNo} (ETB ${total.toFixed(2)}) buffered in browser local memory.` 
          : `Invoice ${invoiceNo} pushed straight to cloud servers. Payments logged.`
      },
      ...prev
    ]);

    // Open physical receipt representation modal
    setLastCompletedOrder(newOrder);
    setIsReceiptModalOpen(true);

    // Clean cart inputs
    setCart([]);
    setCheckoutNotes('');
  };

  // Restock logic inside inventory panel
  const handleRestock = (productId: string, quantity: number) => {
    setProducts(prev => {
      return prev.map(prod => {
        if (prod.id === productId) {
          const newStock = prod.stock + quantity;
          
          setSyncLogs(logs => [
            {
              id: generateId('log'),
              timestamp: new Date().toISOString(),
              action: 'Restock Inventory',
              status: isOffline ? 'pending' : 'synced',
              details: `Restocked ${quantity} units of ${prod.name}. New total on hand: ${newStock} ${prod.unit}.`
            },
            ...logs
          ]);

          return { ...prod, stock: newStock };
        }
        return prod;
      });
    });
  };

  // Add custom product to database list
  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) {
      alert('Please fill out name and price values.');
      return;
    }

    const priceNum = parseFloat(newProductPrice);
    const costNum = parseFloat(newProductCost) || (priceNum * 0.6); // default 60% margin if blank
    const stockNum = parseInt(newProductStock) || 0;

    const custom: Product = {
      id: generateId('prod-custom'),
      name: newProductName,
      sku: `NP-CUST-0${products.length + 1}`,
      category: newProductCategory,
      price: priceNum,
      cost: costNum,
      stock: stockNum,
      minStock: 10,
      unit: newProductUnit,
      taxType: newProductTaxType
    };

    setProducts(prev => [...prev, custom]);
    setIsNewProductModalOpen(false);

    setSyncLogs(logs => [
      {
        id: generateId('u-log'),
        timestamp: new Date().toISOString(),
        action: 'Configure Custom Product',
        status: isOffline ? 'pending' : 'synced',
        details: `Configured new local catalog item: "${newProductName}" with tax type ${newProductTaxType}.`
      },
      ...logs
    ]);

    // reset fields
    setNewProductName('');
    setNewProductPrice('');
    setNewProductCost('');
    setNewProductStock('50');
    setNewProductUnit('kg');
    setNewProductTaxType('VAT');
  };

  // Process barcode scan simulation
  const handleBarcodeScanSubmit = (scannedSkuValue: string) => {
    const cleanSku = scannedSkuValue.trim();
    if (!cleanSku) {
      setScanError('Please enter a SKU/product code.');
      return;
    }

    const matchedProduct = products.find(
      (p) => p.sku.trim().toUpperCase() === cleanSku.toUpperCase()
    );

    if (matchedProduct) {
      if (matchedProduct.stock <= 0) {
        setScanError(`"${matchedProduct.name}" is out of stock. Restock it in Inventory first.`);
        return;
      }

      // Add to cart
      handleAddToCart(matchedProduct);

      // Add log
      setSyncLogs((prev) => [
        {
          id: generateId('scan'),
          timestamp: new Date().toISOString(),
          action: 'Barcode Scan',
          status: isOffline ? 'pending' : 'synced',
          details: `Simulated barcode laser scan for SKU [${matchedProduct.sku}]: Added "${matchedProduct.name}" to cart.`
        },
        ...prev
      ]);

      // Reset & close
      setIsScanModalOpen(false);
      setScanSku('');
      setScanError('');
    } else {
      setScanError(`No product matches SKU code "${cleanSku}". Please verify and try again.`);
    }
  };

  // Computable statistics values based on Synced / Total sales
  const computeStatistics = () => {
    let salesTotal = 0;
    let costGoodsTotal = 0;
    let taxVATCollected = 0;
    let taxTOTCollected = 0;

    orders.forEach(ord => {
      salesTotal += ord.total;
      ord.items.forEach(item => {
        costGoodsTotal += (item.product.cost * item.quantity);
        
        // break out tax allocations
        const itemTotal = item.product.price * item.quantity;
        if (item.product.taxType === 'VAT') {
          taxVATCollected += (itemTotal * EthiopianTaxDefaults.vatPercentage) / 100;
        } else if (item.product.taxType === 'TOT_2') {
          taxTOTCollected += (itemTotal * EthiopianTaxDefaults.totGoodsPercentage) / 100;
        } else if (item.product.taxType === 'TOT_10') {
          taxTOTCollected += (itemTotal * EthiopianTaxDefaults.totServicesPercentage) / 100;
        }
      });
    });

    const approximateProfit = salesTotal - costGoodsTotal - (taxVATCollected + taxTOTCollected);
    const totalTaxDue = taxVATCollected + taxTOTCollected;

    return {
      revenue: salesTotal,
      taxDue: totalTaxDue,
      vatShare: taxVATCollected,
      totShare: taxTOTCollected,
      profit: Math.max(0, approximateProfit),
      concludedOrders: orders.length,
      pendingCount: orders.filter(o => !o.isSynced).length
    };
  };

  const metrics = computeStatistics();

  // Localized Search and filter products
  const filteredProducts = products.filter(prod => {
    const matchCategory = activeCategory === 'All' || prod.category === activeCategory;
    const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Simulated CSV Export
  const handleExportCSV = () => {
    alert('SUCCESS: Secure CSV logs pre-formatted for ERCA tax audits compiled from browser state! Starting browser virtual download of NEXTPOS_TAX_RETURNS.csv.');
    
    const headers = 'InvoiceNo,Timestamp,Subtotal_ETB,TaxAmount_ETB,GrandTotal_ETB,PaymentMethod,SyncStatus\n';
    const rows = orders.map(o => 
      `${o.invoiceNo},${o.timestamp},${o.subtotal.toFixed(2)},${o.taxAmount.toFixed(2)},${o.total.toFixed(2)},${o.paymentMethod},${o.isSynced ? 'SYNCED' : 'LOCAL'}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'NEXTPOS_ET_TAX_RETURNS.csv');
    a.click();
  };

  // Simulated Esc/POS driver binary stream generator formatted for standard Ethiopian thermal receipt rolls
  const downloadEscPosFile = (order: Order) => {
    const escCmds = [];
    escCmds.push('MEMBER ID: NEXTPOS_ET_PRO');
    escCmds.push('STAMP FORMAT: RAW ESC/POS THERMAL BINARY');
    escCmds.push('COMPLIANCE: ERCA TAX-REGS v2.43');
    escCmds.push('=== START TRANSACTION BLOCK ===');
    escCmds.push('[HEX: 1B 40] - ESC @ Initialize Printer');
    escCmds.push('[HEX: 1B 61 01] - ESC a 1 Align Center');
    escCmds.push('      NEXTPOS RETAIL PLC');
    escCmds.push('    BOLE DISTRICT, ADDIS ABABA');
    escCmds.push('      TEL: +251 116 123 456');
    escCmds.push(`   TIN: 00142981-0-22  CASHIER: #02`);
    escCmds.push('----------------------------------');
    escCmds.push(`  INVOICE NO: ${order.invoiceNo}`);
    escCmds.push(`  DATE: ${new Date(order.timestamp).toISOString()}`);
    escCmds.push('----------------------------------');
    escCmds.push('[HEX: 1B 61 00] - ESC a 0 Align Left');
    
    order.items.forEach(item => {
      const nameLine = `${item.product.name} (${item.product.taxType})`;
      escCmds.push(`  ${nameLine.padEnd(20)} ${item.quantity}x`);
      escCmds.push(`    Unit: ETB ${item.product.price.toFixed(2).padStart(8)} Total: ETB ${(item.product.price * item.quantity).toFixed(2).padStart(10)}`);
    });
    
    escCmds.push('----------------------------------');
    escCmds.push('[HEX: 1B 61 02] - ESC a 2 Align Right');
    escCmds.push(`           SUBTOTAL: ETB ${order.subtotal.toFixed(2)}`);
    escCmds.push(`          TAX (VAT): ETB ${order.taxAmount.toFixed(2)}`);
    escCmds.push('[HEX: 1B 45 01] - ESC E 1 Bold Font ON');
    escCmds.push(`        GRAND TOTAL: ETB ${order.total.toFixed(2)}`);
    escCmds.push('[HEX: 1B 45 00] - ESC E 0 Bold Font OFF');
    escCmds.push('----------------------------------');
    escCmds.push('[HEX: 1B 61 01] - ESC a 1 Align Center');
    escCmds.push('[HEX: 1D 28 6B] - GS ( k QR Pay-Verify Link');
    escCmds.push(`  Payload: https://verify.nextpos.et/verify-invoice?no=${order.invoiceNo}`);
    escCmds.push('----------------------------------');
    escCmds.push('  ** AMESEGENALEHU! THANK YOU! **');
    escCmds.push('[HEX: 1D 56 42 00] - GS V 66 0 Paper Feed Cut');
    escCmds.push('=== END TRANSACTION BLOCK ===');
    
    const blob = new Blob([escCmds.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `NEXTPOS_ESC_POS_INVOICE_${order.invoiceNo}.txt`);
    a.click();
  };

  return (
    <div id="sandbox-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Simulation Sandbox Core Console Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 mb-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-left">
        {/* Amber glowing effect if offline */}
        {isOffline && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs uppercase font-mono tracking-widest font-extrabold bg-emerald-500 text-white px-2.5 py-0.5 rounded animate-pulse">
              Interactive Dev Sandbox
            </span>
            {syncing && (
              <span className="text-xs font-semibold text-emerald-300 flex items-center bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-900">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Syncing cache...
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold font-display tracking-tight">NextPOS Terminal Sandbox Playground</h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
            This module represents the primary checkout software. Switch to offline mode, register sales, verify stock metrics, view automatic tax declarations, and monitor how background sync resolves conflicts.
          </p>
        </div>

        {/* Offline Interactive Toggle Switch */}
        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-850 w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center justify-between sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Network Simulator</p>
            <p className="text-[10.5px] text-slate-300">Toggle cellular signal drops</p>
          </div>
          <button
            id="offline-simulator-toggle"
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              isOffline
                ? 'bg-amber-600 hover:bg-amber-700 text-white glow-green'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 mr-1.5" />
                <span>Simulate Online (Connect)</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-1.5" />
                <span>Simulate Offline (Disconnect)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Sub View Tab bar (POS, Reports, Inventory) */}
      <div className="flex flex-wrap items-center bg-slate-900/60 p-1.5 rounded-2xl mb-8 max-w-lg border border-slate-800">
        {[
          { id: 'pos', label: 'POS Terminal', icon: ShoppingCart },
          { id: 'analytics', label: 'Real-time Reports', icon: TrendingUp },
          { id: 'inventory', label: 'Inventory & restock', icon: Boxes },
        ].map((v) => (
          <button
            key={v.id}
            id={`subview-tab-${v.id}`}
            onClick={() => setActiveSubView(v.id as any)}
            className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 justify-center whitespace-nowrap ${
              activeSubView === v.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <v.icon className="w-3.5 h-3.5 mr-1.5" />
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT DECISIONS */}
      
      {/* 1. POS TERMINAL VIEW */}
      {activeSubView === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* POS Product Catalog Panel */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Catalog Sub Bar: search / filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 gap-4">
              {/* Category selector pills */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    id={`filter-cat-${cat.replace(/\s+/g, '')}`}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search text query */}
              <div className="relative w-full sm:w-64 max-w-xs shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="catalog-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog by Teff, coffee..."
                  className="block w-full pl-9 pr-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs text-white placeholder:text-slate-500 bg-[#1E293B]"
                />
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= p.minStock;
                return (
                  <button
                    key={p.id}
                    id={`pos-product-${p.id}`}
                    onClick={() => handleAddToCart(p)}
                    className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/10 transition-all text-left flex flex-col justify-between min-h-[160px] relative group cursor-pointer"
                  >
                    {/* Tax Tag bubble right aligned */}
                    <span className="absolute top-3 right-3 bg-slate-800 text-slate-305 text-slate-300 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                      {p.taxType === 'VAT' ? 'VAT 15%' : p.taxType === 'TOT_2' ? 'TOT 2%' : p.taxType === 'TOT_10' ? 'TOT 10%' : 'EXEMPT'}
                    </span>

                    {/* Stock status indicator pill */}
                    {p.stock === 0 ? (
                      <span className="bg-rose-500/20 text-rose-400 text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded self-start select-none">OUT OF STOCK</span>
                    ) : isLow ? (
                      <span className="bg-amber-500/20 text-amber-400 text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded self-start animate-pulse select-none">LOW STOCK ({p.stock})</span>
                    ) : (
                      <span className="text-slate-400 text-[8.5px] font-mono font-bold select-none">{p.stock} {p.unit} left</span>
                    )}

                    <div className="mt-4">
                      <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-450 group-hover:text-emerald-400 transition-colors font-display leading-tight">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.sku}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 mt-3 flex justify-between items-baseline">
                      <span className="text-base font-extrabold font-display text-emerald-450 text-emerald-400">
                        ETB {p.price.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-400 capitalize">{p.category.split(' & ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Catalog Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="pos-catalog-new-item"
                onClick={() => setIsNewProductModalOpen(true)}
                className="flex items-center justify-center p-4 rounded-xl bg-slate-900 border border-dashed border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 text-xs font-bold transition-all cursor-pointer flex-1"
              >
                <Plus className="w-4 h-4 mr-1 ml-1" />
                <span>Configure New Custom Item</span>
              </button>

              <button
                id="pos-catalog-simulate-scan"
                onClick={() => {
                  setIsScanModalOpen(true);
                  setScanSku('');
                  setScanError('');
                }}
                className="flex items-center justify-center p-4 rounded-xl bg-slate-900 border border-dashed border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 text-xs font-bold transition-all cursor-pointer flex-1"
              >
                <QrCode className="w-4 h-4 mr-1.5" />
                <span>Simulate Barcode Scan</span>
              </button>
            </div>

          </div>

          {/* POS Terminal Checkout Panel */}
          <div className="lg:col-span-4 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-slate-300" />
                <h3 className="text-lg font-bold font-display text-white">Cash Register Terminal</h3>
              </div>
              <span className="bg-slate-800 font-mono text-xs text-slate-300 font-bold px-2 py-0.5 rounded-full select-none">
                {cart.length} items
              </span>
            </div>

            {/* Cart Items list */}
            {cart.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center text-slate-400 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-850 flex items-center justify-center text-slate-400 select-none border border-slate-800">
                  <ShoppingCart className="w-7 h-7 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-white uppercase tracking-wider">Checkout is Empty</p>
                  <p className="text-[10px] text-slate-400 max-w-xs px-4">Click any item card in the custom product catalog to configure an active sale invoice.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-800">
                    <div className="space-y-1 flex-1 pr-3">
                      <p className="font-bold text-white leading-tight">{item.product.name}</p>
                      <p className="text-[9.5px] font-mono text-slate-400">
                        ETB {item.product.price.toFixed(2)} • {item.product.taxType}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      {/* Plus minus logic */}
                      <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700">
                        <button
                          id={`qty-minus-${item.product.id}`}
                          onClick={() => handleUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold font-mono text-[11px] text-white">{item.quantity}</span>
                        <button
                          id={`qty-plus-${item.product.id}`}
                          onClick={() => handleUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        id={`delete-cart-${item.product.id}`}
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}            {/* Bill computation sums */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal amount</span>
                <span className="font-mono text-white">ETB {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Computed VAT/TOT</span>
                <span className="font-mono text-amber-400 font-semibold">+ ETB {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-slate-800">
                <span className="text-sm font-bold text-white font-display">GRAND BILL TOTAL</span>
                <span className="text-xl font-extrabold font-mono font-display text-emerald-400">
                  ETB {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout parameters form */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Payment Network</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Telebirr', label: 'telebirr', color: 'border-teal-500/30 text-teal-300 bg-teal-500/10' },
                    { id: 'CBE Birr', label: 'CBE Birr', color: 'border-blue-500/30 text-blue-300 bg-blue-500/10' },
                    { id: 'Cash', label: 'Cash (Kesh)', color: 'border-slate-700 text-slate-300 bg-slate-800/40' },
                    { id: 'Chapa', label: 'Chapa Web', color: 'border-emerald-500/30 text-emerald-305 text-emerald-300 bg-emerald-500/10' }
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      id={`pay-btn-${pay.id.replace(/\s+/g, '')}`}
                      onClick={() => setSelectedPayment(pay.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-[10px] transition-all cursor-pointer ${
                        selectedPayment === pay.id
                          ? `${pay.color} border-slate-400 font-extrabold ring-1 ring-slate-400`
                          : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {pay.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Optional Sale Memo</label>
                <input
                  type="text"
                  id="checkout-notes"
                  value={checkoutNotes}
                  onChange={(e) => setCheckoutNotes(e.target.value)}
                  placeholder="Memo (e.g. Regular wholesale discount)"
                  className="block w-full px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs text-white placeholder:text-slate-500 bg-[#1E293B]"
                />
              </div>

              <button
                type="submit"
                id="submit-checkout-btn"
                disabled={cart.length === 0}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                  cart.length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
                    : isOffline
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xl shadow-amber-950/20'
                      : 'bg-emerald-600 hover:bg-emerald-550 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/20'
                }`}
              >
                <span>{isOffline ? 'Queuing Sale Locally' : 'Print ERCA Invoice Checkout'}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>

        </div>
      )}


      {/* 2. REAL-TIME REPORTS VIEW */}
      {activeSubView === 'analytics' && (
        <div className="space-y-8 text-left">
          
          {/* Key Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Aggregated Gross Sales</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold font-mono tracking-tight text-white">ETB {metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-[9.5px] bg-emerald-500/10 text-emerald-450 text-emerald-400 px-1.5 py-0.5 rounded-full font-mono font-bold uppercase border border-emerald-500/20">Revenue</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-normal">Derived across {metrics.concludedOrders} active transactions inside browser state.</p>
            </div>

            {/* Computed profit margin estimation */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Estimated Gross Margins</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold font-mono tracking-tight text-emerald-400">ETB {metrics.profit.toFixed(2)}</span>
                <span className="text-[9.5px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-full uppercase">Profit</span>
              </div>
              <p className="text-[10.5px] text-slate-400">Excluding localized tax liabilities. Profit = price minus costs.</p>
            </div>

            {/* Tax Declared (VAT/TOT liability tracker) */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Total ERCA Tax Collected</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold font-mono tracking-tight text-amber-500">ETB {metrics.taxDue.toFixed(2)}</span>
                <span className="text-[9.5px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full uppercase font-mono">Tax Liab.</span>
              </div>
              <p className="text-[10.5px] text-slate-400">VAT (ETB {metrics.vatShare.toFixed(0)}) & TOT (ETB {metrics.totShare.toFixed(0)}) broken logs.</p>
            </div>

            {/* Sync Queue status indicators */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-2 shadow-xl">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Offline Pending Buffer</span>
              <div className="flex justify-between items-baseline">
                <span className={`text-2xl font-extrabold font-mono tracking-tight ${metrics.pendingCount > 0 ? 'text-amber-550 text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                  {metrics.pendingCount} Sales
                </span>
                <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full uppercase font-bold text-xs border ${
                  metrics.pendingCount > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {metrics.pendingCount > 0 ? 'Local' : 'Clean'}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400">
                {metrics.pendingCount > 0 
                  ? 'Connect the Network Simulation on top to automatically synchronize pending payments.' 
                  : 'All transactions safely backed-up to NextPOS cloud database.'
                }
              </p>
            </div>
          </div>

          {/* KPI Analytics: Sales trends chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Trends Chart Layout (Interactive Custom SVG) */}
            <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-3xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-850 pb-4 gap-2">
                <div>
                  <h3 className="text-base font-bold font-display text-white">7-Day Daily Transaction Trends</h3>
                  <p className="text-xs text-slate-400">Interactive historical breakdown of transacted volumes in Ethiopian Birr (ETB) over the last 7 days</p>
                </div>
                
                {/* Export button */}
                <button
                  id="csv-export-trigger"
                  onClick={handleExportCSV}
                  className="flex items-center px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
                >
                  <ArrowDownToLine className="w-4 h-4 mr-1.5" />
                  <span>Export ERCA Audits Log</span>
                </button>
              </div>

              {/* Daily Sales Recharts Line Chart */}
              {orders.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-405 text-slate-400">
                  <p className="text-xs font-mono font-bold">No transacted values found in active memory buffer yet.</p>
                </div>
              ) : (
                <div className="h-64 pt-4 pr-2 text-left">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={weeklySalesData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="rechartsSalesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(v) => `${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
                      />
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-2xl shadow-xl font-mono text-[11px] text-left">
                                <p className="font-bold text-slate-300 mb-1">Sales ({data.name})</p>
                                <div className="space-y-0.5">
                                  <p className="text-emerald-400 font-extrabold">ETB {Number(payload[0].value).toFixed(2)}</p>
                                  <p className="text-slate-500 font-medium">{data.txCount} Transaction{data.txCount !== 1 ? 's' : ''}</p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#rechartsSalesGrad)" 
                        dot={{ r: 4, stroke: '#ffffff', strokeWidth: 1.5, fill: '#10b981' }}
                        activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2, fill: '#10b981' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Payment Method Split & Tax Category Distribution */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Category split metrics */}
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-3xs space-y-4">
                <h3 className="text-base font-bold font-display text-white">Payment Modes Share</h3>
                <p className="text-[11px] text-slate-400 leading-tight">Proportion of transactions completed through cash vs mobile systems</p>

                {/* Simulated percentage metrics bars */}
                <div className="space-y-4 pt-2">
                  {[
                    { mode: 'Telebirr', color: 'bg-teal-500', share: orders.filter(o => o.paymentMethod === 'Telebirr').length },
                    { mode: 'CBE Birr', color: 'bg-blue-600', share: orders.filter(o => o.paymentMethod === 'CBE Birr').length },
                    { mode: 'Cash', color: 'bg-slate-400', share: orders.filter(o => o.paymentMethod === 'Cash').length },
                    { mode: 'Chapa', color: 'bg-emerald-500', share: orders.filter(o => o.paymentMethod === 'Chapa').length },
                  ].map((pay) => {
                    const count = pay.share;
                    const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                    
                    return (
                      <div key={pay.mode} className="space-y-1.5 text-xs text-slate-400">
                        <div className="flex justify-between font-medium">
                          <span className="flex items-center text-slate-300 font-sans">
                            <span className={`w-2 h-2 rounded-full ${pay.color} mr-2`}></span>
                            {pay.mode} Support
                          </span>
                          <span className="font-mono font-bold text-white">{pct.toFixed(0)}% ({count} sales)</span>
                        </div>
                        <div className="w-full bg-slate-850 rounded-full h-2">
                          <div className={`h-2 rounded-full ${pay.color}`} style={{ width: `${Math.max(pct, 4)}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* National taxes breakdown block */}
              <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-[11px] text-slate-300">
                <p className="font-extrabold text-emerald-400 uppercase tracking-widest text-[10px] border-b border-slate-800 pb-2 flex items-center">
                  <Database className="w-4 h-4 mr-1.5 text-emerald-400" />
                  ERCA COMPLIANCE SUMMARY
                </p>
                <div className="flex justify-between">
                  <span>VAT Standard (15%) Total:</span>
                  <span className="font-bold text-white">ETB {metrics.vatShare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Goods TOT (2%) Total:</span>
                  <span className="font-bold text-white">ETB {metrics.totShare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-800 pt-2 font-bold text-emerald-400">
                  <span>Aggregation Tax Balance Due:</span>
                  <span>ETB {metrics.taxDue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sync log audit ledger */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-3xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-base font-bold font-display text-white">System Logs & Sync Handshakes</h3>
                <p className="text-xs text-slate-400">Live ledger of offline buffer events and browser database writes</p>
              </div>
              <button
                id="clear-logs-btn"
                onClick={() => setSyncLogs([{ id: 'log-1', timestamp: new Date().toISOString(), action: 'Logs cleared', status: 'synced', details: 'Manual sync audit ledger cleared by merchant.' }])}
                className="text-xs text-slate-400 hover:text-white transition-colors font-bold cursor-pointer"
              >
                Clear Audit Trail
              </button>
            </div>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2 font-mono text-[11px] text-left">
              {syncLogs.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row items-baseline justify-between py-2 border-b border-slate-800 last:border-0 gap-1.5">
                  <div className="space-y-1 font-sans">
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono uppercase">{log.action}</span>
                    <p className="text-slate-400 leading-relaxed text-xs">{log.details}</p>
                  </div>
                  <div className="flex flex-col text-right items-end shrink-0">
                    <span className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 border ${
                      log.status === 'synced' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}


      {/* 3. INVENTORY & STOCK RESTOCKING VIEW */}
      {activeSubView === 'inventory' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-6 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
            <div>
              <h3 className="text-lg font-bold font-display text-white">Localized Stock & Profit margins monitoring</h3>
              <p className="text-xs text-slate-400">Configure cost-to-margin percentages, minimum thresholds, and append stocks in kg, packs, or pieces.</p>
            </div>
            
            {/* Create Product Button */}
            <button
              id="inventory-new-product-trigger"
              onClick={() => setIsNewProductModalOpen(true)}
              className="flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              <Plus className="w-4 h-4 mr-1 ml-1" />
              <span>Configure New Item</span>
            </button>
          </div>

          {/* Simple Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-850 font-mono font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Catalog Product</th>
                  <th className="py-3 px-4">SKU / Code</th>
                  <th className="py-3 px-4">Cost vs Price (ETB)</th>
                  <th className="py-3 px-4">Tax Preset</th>
                  <th className="py-3 px-4 text-center">Remaining Balance</th>
                  <th className="py-3 px-4 text-right">Quickrestock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  // margins compute
                  const profitMarginAmt = p.price - p.cost;
                  const profitMarginPct = p.price > 0 ? (profitMarginAmt / p.price) * 100 : 0;
                  
                  return (
                    <tr key={p.id} className={`hover:bg-slate-800/40 transition-colors ${isLow ? 'bg-amber-500/5' : ''}`}>
                      <td className="py-4 px-4 font-bold text-white font-display">
                        <div>
                          <span>{p.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal capitalize font-sans">{p.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-400">{p.sku}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-white font-mono">ETB {p.price.toFixed(2)}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Cost: ETB {p.cost.toFixed(2)} ({profitMarginPct.toFixed(0)}% Margin)</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-400 font-sans">
                        <span className="bg-slate-800 text-slate-300 border border-slate-750 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                          {p.taxType}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center font-sans">
                          <span className={`font-extrabold font-mono text-sm ${isLow ? 'text-rose-400 animate-pulse font-extrabold' : 'text-slate-300'}`}>
                            {p.stock}
                          </span>
                          <span className="text-[10px] text-slate-400 text-xs lowercase font-semibold">{p.unit}</span>
                          {isLow && (
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full mt-1 flex items-center select-none font-sans">
                              <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                              REPLENISH!
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            id={`restock-10-${p.id}`}
                            onClick={() => handleRestock(p.id, 10)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            +10 {p.unit}
                          </button>
                          <button
                            id={`restock-50-${p.id}`}
                            onClick={() => handleRestock(p.id, 50)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            +50 {p.unit}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* RECEIPT PREVIEW MODAL */}
      <AnimatePresence>
        {isReceiptModalOpen && lastCompletedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-slate-800 shadow-2xl space-y-6 text-left relative"
            >
              <button
                id="close-receipt-modal-cross"
                onClick={() => setIsReceiptModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-white">Ethiopian Thermal Printer & Compliance Sandbox</h3>
                    <p className="text-xs text-slate-400">Preview simulated 80mm/58mm standard ERCA ticket feeds, debug control bytes, and verify digital payment payloads.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: VIRTUAL THERMAL PRINTER HARDWARE FEED */}
                <div className="md:col-span-5 flex flex-col items-center justify-start space-y-4">
                  
                  {/* Simulated Printer Slots */}
                  <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-2 shadow-inner relative overflow-hidden">
                    <div className="w-full h-4 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 rounded-lg shadow-inner flex items-center justify-between px-3">
                      <div className="flex items-center space-x-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSimulatingFeed ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className="text-[6.5px] font-mono text-slate-500 font-extrabold">ONLINE</span>
                      </div>
                      <div className="text-[7px] font-mono text-slate-500 select-none tracking-widest font-extrabold uppercase">80MM & 58MM PAPER FEED EXIT</div>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                  </div>

                  {/* Physical receipt simulation rollup */}
                  <motion.div 
                    initial={{ scaleY: 0, originY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    className="w-full"
                  >
                    <div className="text-center select-none font-sans bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40 mb-3">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                      <h4 className="text-sm font-bold text-white leading-tight">Invoice Generated successfully!</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {lastCompletedOrder.isSynced 
                          ? 'Synchronized compliant transaction.' 
                          : 'Buffered locally in client offline queue.'
                        }
                      </p>
                    </div>

                    <motion.div
                      style={{ maxHeight: isSimulatingFeed ? `${feedProgress}%` : 'none' }}
                      className={`overflow-hidden bg-white text-slate-900 shadow-2xl relative select-none rounded-b-md mx-auto transition-all duration-300 border border-slate-350 ${
                        selectedPrinterWidth === '58mm' ? 'max-w-[220px] text-[8.5px]' : 'max-w-[280px] text-[10px]'
                      }`}
                    >
                      {/* Dotted top edge of paper */}
                      <div className="h-2 w-full bg-[#E2E8F0] select-none flex overflow-hidden border-b border-dashed border-slate-300">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-slate-900 rounded-full shrink-0 -translate-y-2 mx-0.5" />
                        ))}
                      </div>

                      <div className="p-4 font-mono space-y-4">
                        <div className="text-center border-b border-dashed border-slate-300 pb-3">
                          <h4 className="font-extrabold text-[11px] text-slate-900 font-sans tracking-wide">NEXTPOS RETAIL PLC</h4>
                          <p className="text-[8.5px] text-slate-500">BOLE DISTRICT ROAD, ADDIS ABABA</p>
                          <p className="text-[8.5px] text-slate-500">TEL: +251 116 123 456</p>
                          <p className="text-[8.5px] text-slate-500 font-bold">TIN NO: 00142981-0-22</p>
                          <p className="text-[9.5px] mt-2 font-bold text-slate-900">INVOICE: FSC-{lastCompletedOrder.invoiceNo}</p>
                          <p className="text-[8px] text-slate-400 mt-0.5">
                            Date: {new Date(lastCompletedOrder.timestamp).toLocaleDateString()} {new Date(lastCompletedOrder.timestamp).toLocaleTimeString()}
                          </p>
                        </div>

                        {/* Goods block column formatting */}
                        <div className="space-y-2.5 border-b border-dashed border-slate-300 pb-3">
                          <div className="flex justify-between font-bold text-slate-400 text-[8.5px]">
                            <span>DESC (TAX-REF)</span>
                            <span>TOTAL (ETB)</span>
                          </div>
                          {lastCompletedOrder.items.map((item, id) => (
                            <div key={id} className="flex justify-between leading-normal">
                              <div className="max-w-[70%] text-left">
                                <p className="font-bold text-slate-900 leading-tight">{item.product.name}</p>
                                <p className="text-[8px] text-slate-500">
                                  {item.quantity} {item.product.unit} x ETB {item.product.price.toFixed(2)} ({item.product.taxType})
                                </p>
                              </div>
                              <span className="font-bold text-slate-900 pr-1 shrink-0">
                                ETB {(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Sum block */}
                        <div className="space-y-1.5 font-bold text-slate-800 text-right pr-1">
                          <div className="flex justify-between text-slate-500 text-[9px]">
                            <span>SUBTOTAL:</span>
                            <span>ETB {lastCompletedOrder.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-[9px]">
                            <span>TOTAL VAT/TOT TAX COMP.%:</span>
                            <span>+ ETB {lastCompletedOrder.taxAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-slate-950 text-xs border-t border-dashed border-slate-300 pt-1.5 font-extrabold">
                            <span>GRAND TOTAL (ETB):</span>
                            <span>ETB {lastCompletedOrder.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* QR Placeholder code for digital validation */}
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center space-y-1.5 text-center text-slate-800">
                          <span className="text-[7.5px] uppercase font-extrabold tracking-wider text-slate-500 font-sans">Security Compliance Stamp</span>
                          
                          <div className="bg-white p-1 rounded-lg border border-slate-300 shadow-xs relative">
                            <svg viewBox="0 0 100 100" className="w-20 h-20 bg-white">
                              {/* Standard corners */}
                              <rect x="5" y="5" width="25" height="25" fill="#0D172A" />
                              <rect x="10" y="10" width="15" height="15" fill="#FFFFFF" />
                              <rect x="13" y="13" width="9" height="9" fill="#0D172A" />
                              
                              <rect x="70" y="5" width="25" height="25" fill="#0D172A" />
                              <rect x="75" y="10" width="15" height="15" fill="#FFFFFF" />
                              <rect x="78" y="13" width="9" height="9" fill="#0D172A" />

                              <rect x="5" y="70" width="25" height="25" fill="#0D172A" />
                              <rect x="10" y="75" width="15" height="15" fill="#FFFFFF" />
                              <rect x="13" y="78" width="9" height="9" fill="#0D172A" />

                              {/* Pixelated layout keys */}
                              {selectedVerifyMethod === 'telebirr' && (
                                <path d="M 35 15 h 5 v 5 h -5 z M 45 5 h 10 v 5 h -10 z M 50 15 h 5 v 10 h -5 z M 35 30 h 10 v 5 h -10 z M 55 35 h 5 v 5 h -5 z M 75 45 h 10 v 5 h -10 z M 15 35 h 5 v 5 h -5 z M 5 45 h 10 v 5 h -10 z M 35 50 h 20 v 5 h -20 z M 65 65 h 5 v 15 h -5 z M 45 75 h 15 v 5 h -15 z M 80 80 h 15 v 15 h -15 z M 80 70 h 5 v 5 h -5 z M 70 85 h 5 v 5 h -5 z" fill="#10B981" />
                              )}
                              {selectedVerifyMethod === 'cbe' && (
                                <path d="M 35 15 h 10 v 5 h -10 z M 45 5 h 5 v 15 h -5 z M 55 10 h 5 v 10 h -5 z M 35 30 h 5 v 10 h -5 z M 50 35 h 10 v 5 h -10 z M 75 45 h 5 v 15 h -5 z M 15 35 h 10 v 5 h -10 z M 5 45 h 5 v 5 h -5 z M 35 50 h 15 v 5 h -15 z M 60 65 h 15 v 15 h -15 z M 45 75 h 5 v 5 h -5 z M 85 80 h 10 v 10 h -10 z M 80 70 h 10 v 5 h -10 z" fill="#3B82F6" />
                              )}
                              {selectedVerifyMethod === 'erca' && (
                                <path d="M 35 15 h 5 v 5 h -5 z M 45 5 h 15 v 5 h -15 z M 50 15 h 10 v 10 h -10 z M 35 30 h 20 v 5 h -20 z M 55 35 h 5 v 5 h -5 z M 75 45 h 15 v 15 h -15 z M 15 35 h 5 v 5 h -5 z M 5 45 h 15 v 20 h -15 z M 35 50 h 10 v 5 h -10 z M 65 65 h 15 v 15 h -15 z M 45 75 h 5 v 5 h -5 z M 80 80 h 10 v 10 h -10 z M 80 70 h 5 v 5 h -5 z" fill="#D97706" />
                              )}

                              {/* Target point brand */}
                              <rect x="36" y="36" width="28" height="28" fill="#FFFFFF" rx="4" />
                              <rect x="39" y="39" width="22" height="22" fill={selectedVerifyMethod === 'telebirr' ? '#10B981' : selectedVerifyMethod === 'cbe' ? '#2563EB' : '#D97706'} rx="3" />
                              <text x="50" y="52" fill="#FFFFFF" fontSize="7" fontWeight="black" textAnchor="middle" fontFamily="monospace">
                                {selectedVerifyMethod === 'telebirr' ? 'tb' : selectedVerifyMethod === 'cbe' ? 'cbe' : 'et'}
                              </text>
                            </svg>
                          </div>

                          <span className="block text-[7.5px] uppercase font-bold tracking-tight text-slate-800">
                            {selectedVerifyMethod === 'telebirr' ? 'Telebirr Pay Verification' : selectedVerifyMethod === 'cbe' ? 'CBE Birr API Ledger reference' : 'ERCA Fiscal Audit Sig'}
                          </span>
                        </div>

                        {/* Footer specs */}
                        <div className="border-t border-dashed border-slate-300 pt-3 flex flex-col items-center space-y-1 text-[8px] text-slate-500 text-center uppercase font-bold select-none">
                          <p>Payment Mode: {lastCompletedOrder.paymentMethod}</p>
                          <p className="text-[7px] italic tracking-tight font-normal lowercase leading-tight">Registered via nextpos offline-compliant sandboxes.</p>
                          <p className="text-[6.5px] text-slate-400 italic">** AMESEGENALEHU **</p>
                        </div>
                      </div>

                      {/* Dotted bottom edge of paper */}
                      <div className="h-2 w-full bg-[#E2E8F0] select-none flex overflow-hidden border-t border-dashed border-slate-300">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-slate-900 rounded-full shrink-0 mx-0.5" />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* RIGHT COLUMN: SANDBOX CONFIGURATION & CONTROLS */}
                <div className="md:col-span-7 space-y-5 text-slate-300">
                  
                  {/* CONFIG 1: Roll Width */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-sans flex items-center">
                      <span className="inline-block w-4 h-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center leading-3 font-mono text-[9px] mr-1.5 flex items-center justify-center font-bold">1</span>
                      Select Printer width roll
                    </p>
                    <div className="grid grid-cols-2 gap-3 font-sans">
                      <button
                        onClick={() => setSelectedPrinterWidth('80mm')}
                        className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedPrinterWidth === '80mm'
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <span className="block text-xs font-bold text-white">80mm Countertop Width</span>
                        <span className="block text-[9px] opacity-70 mt-0.5">Used in standard cashier Epson rolls.</span>
                      </button>
                      <button
                        onClick={() => setSelectedPrinterWidth('58mm')}
                        className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedPrinterWidth === '58mm'
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <span className="block text-xs font-bold text-white">58mm Portable Width</span>
                        <span className="block text-[9px] opacity-70 mt-0.5">Used in mobile POS handheld smart cards.</span>
                      </button>
                    </div>
                  </div>

                  {/* CONFIG 2: QR Selector */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-sans flex items-center">
                      <span className="inline-block w-4 h-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center leading-3 font-mono text-[9px] mr-1.5 flex items-center justify-center font-bold">2</span>
                      Dynamic QR Code verification standard
                    </p>
                    <div className="grid grid-cols-3 gap-2.5 font-sans">
                      {[
                        { type: 'telebirr', title: 'Telebirr QuickPay', color: 'hover:border-emerald-500 hover:text-emerald-400 border-emerald-500/10' },
                        { type: 'cbe', title: 'CBE Birr Ledger', color: 'hover:border-blue-500 hover:text-blue-400 border-blue-500/10' },
                        { type: 'erca', title: 'ERCA Fiscal Sig', color: 'hover:border-amber-500 hover:text-amber-450 border-amber-500/10' }
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => setSelectedVerifyMethod(item.type as any)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer text-center ${
                            selectedVerifyMethod === item.type
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-extrabold'
                              : `border-slate-800 text-slate-400 ${item.color} bg-slate-950/20`
                          }`}
                        >
                          <span className="text-[10px] leading-tight block">{item.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CONFIG 3: Collapsible ESC/POS Bytes Terminal */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-left">
                    <div className="flex justify-between items-center bg-slate-900">
                      <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-sans flex items-center">
                        <span className="inline-block w-4 h-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center leading-3 font-mono text-[9px] mr-1.5 flex items-center justify-center font-bold">3</span>
                        Raw ESC/POS Driver Instructions
                      </p>
                      <button
                        onClick={() => setShowEscPosBytes(!showEscPosBytes)}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase hover:underline cursor-pointer font-sans"
                      >
                        {showEscPosBytes ? 'Hide Bytes' : 'Inspect Bytes'}
                      </button>
                    </div>

                    {showEscPosBytes && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-slate-950 border border-slate-850 rounded-xl p-3 font-mono text-[9.5px] text-slate-400 space-y-2 select-text"
                      >
                        <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded border border-slate-800 text-emerald-400 font-bold font-sans">
                          <span className="text-[8.5px]">EPSON THERMAL CODE DIALECT REFERENCE</span>
                          <button
                            onClick={() => {
                              const escText = `[ESC/POS INVOICE RAW STREAM COMPLIANT WITH ERCA ETHIOPIA]
TIN: 00142981-0-22
INVOICE: FSC-${lastCompletedOrder.invoiceNo}
TOTAL: ETB ${lastCompletedOrder.total.toFixed(2)}
Verification Standard: ${selectedVerifyMethod.toUpperCase()}`;
                              try {
                                navigator.clipboard.writeText(escText);
                                alert('ESC/POS control sequences copied to local memory! Ready to pipe to 80/58mm printers.');
                              } catch (e) {
                                alert(escText);
                              }
                            }}
                            className="text-[8px] bg-slate-800 hover:bg-slate-750 px-2 py-0.5 rounded text-white cursor-pointer"
                          >
                            Copy Hex Stream
                          </button>
                        </div>
                        <div className="max-h-[120px] overflow-y-auto space-y-1 text-left scrollbar-thin scrollbar-thumb-slate-800 pr-1 select-text">
                          <p className="text-slate-500 font-semibold">[ESC @] - 1B 40 (Initialize Printer Register)</p>
                          <p className="text-slate-500 font-semibold">[ESC a 1] - 1B 61 01 (Align Header Center)</p>
                          <p className="text-white">"      NEXTPOS RETAIL PLC"</p>
                          <p className="text-slate-500 font-semibold">[ESC a 0] - 1B 61 00 (Align Left Items Column)</p>
                          {lastCompletedOrder.items.map((item, idx) => (
                            <p key={idx} className="text-emerald-300">
                              "  {item.product.name.padEnd(16)} {item.quantity}x-ETB-{item.product.price.toFixed(0)}"
                            </p>
                          ))}
                          <p className="text-slate-500 font-semibold">[ESC a 2] - 1B 61 02 (Align Right Grand Sums)</p>
                          <p className="text-amber-400">"GRAND TOTAL: ETB {lastCompletedOrder.total.toFixed(2)}"</p>
                          <p className="text-slate-500 font-semibold">[GS k] - 1D 28 6B (Embed compliance verification QR)</p>
                          <p className="text-slate-500 font-semibold">[GS V 66] - 1D 56 42 00 (Pneumatic Paper Cut Trigger)</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* CONFIG 4: Simulatable printer action nodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left font-sans">
                    <button
                      onClick={() => {
                        setIsSimulatingFeed(true);
                        setFeedProgress(0);
                        const interval = setInterval(() => {
                          setFeedProgress((prev) => {
                            if (prev >= 100) {
                              clearInterval(interval);
                              setIsSimulatingFeed(false);
                              return 100;
                            }
                            return prev + 10;
                          });
                        }, 90);
                      }}
                      id="refeed-thermal-action"
                      className="py-2.5 bg-slate-800 hover:bg-slate-755 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin-slow text-emerald-400" />
                      <span>Re-feed Roll / Simulate Feed</span>
                    </button>

                    <button
                      onClick={() => downloadEscPosFile(lastCompletedOrder)}
                      id="download-escpos-action"
                      className="py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-805 text-slate-300 hover:text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                      <span>Save ESC/POS File (.txt)</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Main Dialog buttons */}
              <div className="flex space-x-4 border-t border-slate-800 pt-6 font-sans">
                <button
                  id="receipt-print-action"
                  onClick={() => {
                    alert(`Thermal print job submitted! Format: ${selectedPrinterWidth} roll | Target compliance style: ${selectedVerifyMethod.toUpperCase()}.\nStarting standard system driver connection.`);
                    try {
                      window.print();
                    } catch (e) {
                      console.log("Printing context blocked in iframe environment.");
                    }
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-950/20 transition-all border border-emerald-500/20 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Execute Print Action</span>
                </button>
                <button
                  id="receipt-close-action"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs rounded-xl text-center cursor-pointer transition-all active:scale-95"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* NEW PRODUCT ADDITION MODAL */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-250 text-left">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-4 relative transform animate-in slide-in-from-bottom-4 duration-300">
            <button
              id="close-product-modal-cross"
              onClick={() => setIsNewProductModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold font-display text-white">Configure New Local Product</h3>
              <p className="text-xs text-slate-400 mt-1">Configure localized pricing cost-to-profit indexes, stock counts, and tax categories.</p>
            </div>

            <form onSubmit={handleAddCustomProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 font-sans">Product Name</label>
                <input
                  type="text"
                  id="new-prod-name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Bespoke Shiro powder (Export Grade)"
                  className="block w-full px-3.5 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs text-white bg-[#1E293B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 font-sans">Category</label>
                  <select
                    id="new-prod-category"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs text-white bg-[#1E293B]"
                  >
                    <option>Grains & Snacks</option>
                    <option>Prepared Food & Drinks</option>
                    <option>Apparel & Crafts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 font-sans">Item Unit</label>
                  <input
                    type="text"
                    id="new-prod-unit"
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    placeholder="e.g. kg, pcs, pack"
                    className="block w-full px-3 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs text-white bg-[#1E293B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-sans">Customer Price</label>
                  <input
                    type="number"
                    id="new-prod-price"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="ETB"
                    className="block w-full px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs font-mono text-white bg-[#1E293B]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-sans">Supplier Cost</label>
                  <input
                    type="number"
                    id="new-prod-cost"
                    value={newProductCost}
                    onChange={(e) => setNewProductCost(e.target.value)}
                    placeholder="ETB"
                    className="block w-full px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs font-mono text-white bg-[#1E293B]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-sans">Initial Stock</label>
                  <input
                    type="number"
                    id="new-prod-stock"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    placeholder="Units"
                    className="block w-full px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs font-mono text-white bg-[#1E293B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 opacity-90 font-sans">National Tax Category Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'VAT', rate: 'Standard 15%' },
                    { id: 'TOT_2', rate: 'Goods 2%' },
                    { id: 'TOT_10', rate: 'Services 10%' },
                    { id: 'EXEMPT', rate: 'Duty Exempt' }
                  ].map((tax) => (
                    <button
                      key={tax.id}
                      type="button"
                      id={`form-tax-btn-${tax.id}`}
                      onClick={() => setNewProductTaxType(tax.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        newProductTaxType === tax.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-extrabold ring-1 ring-emerald-500'
                          : 'border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <p className="font-extrabold text-[11px] font-sans">{tax.id}</p>
                      <p className="text-[9px] font-mono mt-0.5 opacity-80">{tax.rate}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3 text-xs font-bold font-sans">
                <button
                  type="button"
                  id="cancel-product-modal-btn"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-5 py-3 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-product-modal-btn"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white transition-all rounded-xl shadow-lg shadow-emerald-950/20 cursor-pointer"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE SCANNER SIMULATION MODAL */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-5 text-left relative transform animate-in slide-in-from-bottom-4 duration-300">
            <button
              id="close-scan-modal-cross"
              onClick={() => {
                setIsScanModalOpen(false);
                setScanSku('');
                setScanError('');
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <QrCode className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-bold font-display text-white">Simulate Barcode Scan</h3>
              </div>
              <p className="text-xs text-slate-400">
                Input any product SKU manually or choose from the catalog shortcuts below to simulate a hardware laser scan.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBarcodeScanSubmit(scanSku);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 font-sans">
                  Enter SKU / Product Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="barcode-scan-input"
                    autoFocus
                    placeholder="e.g. NP-SP-001"
                    value={scanSku}
                    onChange={(e) => {
                      setScanSku(e.target.value);
                      if (scanError) setScanError('');
                    }}
                    className="block flex-1 px-3.5 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 text-xs text-white bg-[#1E293B] font-mono"
                  />
                  <button
                    type="submit"
                    id="barcode-scan-submit-btn"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0 shadow-md shadow-emerald-950/20"
                  >
                    Scan Code
                  </button>
                </div>
                {scanError && (
                  <p className="text-xs text-rose-400 mt-2 font-mono flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    {scanError}
                  </p>
                )}
              </div>
            </form>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider font-sans">
                Catalog SKU Shortcuts (Click to scan)
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-[185px] overflow-y-auto pr-1">
                {products.map((p) => (
                  <button
                    key={p.id}
                    id={`scan-shortcut-${p.id}`}
                    onClick={() => {
                      setScanSku(p.sku);
                      handleBarcodeScanSubmit(p.sku);
                    }}
                    className="p-2 border border-slate-800 hover:border-emerald-500 hover:bg-slate-805 hover:bg-slate-800/40 rounded-xl text-left text-xs transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="font-semibold text-white group-hover:text-emerald-400 truncate w-full">
                      {p.name}
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400 font-mono">
                      <span>{p.sku}</span>
                      <span className={p.stock === 0 ? "text-rose-400" : "text-slate-500"}>
                        {p.stock > 0 ? `${p.stock} left` : "Out"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3 text-xs font-bold font-sans">
              <button
                type="button"
                id="close-scan-modal-btn"
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanSku('');
                  setScanError('');
                }}
                className="px-5 py-3 border border-slate-800 hover:border-slate-700 text-slate-400/90 hover:text-white transition-colors rounded-xl cursor-pointer w-full text-center"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
