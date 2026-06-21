/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; // in ETB
  cost: number; // in ETB (for profit margins)
  stock: number;
  minStock: number; // threshold warning
  unit: string; // e.g. "pcs", "kg", "pack"
  taxType: 'VAT' | 'TOT_2' | 'TOT_10' | 'EXEMPT';
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  invoiceNo: string; // e.g., NP-2026-0001
  timestamp: string; // ISO date string
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  paymentMethod: 'Cash' | 'Telebirr' | 'CBE Birr' | 'Chapa' | 'Card';
  isSynced: boolean;
  notes?: string;
}

export interface TaxConfig {
  vatPercentage: number; // Default 15% (Ethiopian Value Added Tax)
  totGoodsPercentage: number; // Default 2% (Turn-over Tax for goods)
  totServicesPercentage: number; // Default 10% (Turn-over Tax for services)
}

export type NavigationTab = 'landing' | 'pricing' | 'about' | 'learning' | 'sandbox';

export interface SyncLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'pending' | 'synced' | 'failed';
  details: string;
}
