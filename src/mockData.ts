/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, TaxConfig, Order } from './types';

export const EthiopianTaxDefaults: TaxConfig = {
  vatPercentage: 15, // Value Added Tax (VAT) rate in Ethiopia
  totGoodsPercentage: 2, // Turn-Over Tax (TOT) for goods
  totServicesPercentage: 10, // Turn-Over Tax (TOT) for services
};

export const InitialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Qolo (Roasted Barley Mix)',
    sku: 'NP-SP-001',
    category: 'Grains & Snacks',
    price: 45.00,
    cost: 25.00,
    stock: 120,
    minStock: 20,
    unit: 'pack',
    taxType: 'TOT_2', // 2% Turn-over-tax on retail goods (micro-business rate)
  },
  {
    id: 'prod-2',
    name: 'Habesha Coffee (Traditional Roast)',
    sku: 'NP-FD-002',
    category: 'Prepared Food & Drinks',
    price: 320.00,
    cost: 180.00,
    stock: 45,
    minStock: 10,
    unit: 'kg',
    taxType: 'VAT', // 15% standard VAT
  },
  {
    id: 'prod-3',
    name: 'Teff Flour (Magna Grade)',
    sku: 'NP-GR-003',
    category: 'Grains & Snacks',
    price: 125.00,
    cost: 95.00,
    stock: 350,
    minStock: 50,
    unit: 'kg',
    taxType: 'EXEMPT', // Primary agricultural foods are often tax exempt
  },
  {
    id: 'prod-4',
    name: 'Pure Ethiopian White Honey',
    sku: 'NP-FD-004',
    category: 'Prepared Food & Drinks',
    price: 480.00,
    cost: 310.00,
    stock: 15,
    minStock: 8,
    unit: 'kg',
    taxType: 'VAT',
  },
  {
    id: 'prod-5',
    name: 'Injera Pack (10 Pieces)',
    sku: 'NP-FD-005',
    category: 'Prepared Food & Drinks',
    price: 150.00,
    cost: 110.00,
    stock: 60,
    minStock: 15,
    unit: 'pack',
    taxType: 'TOT_2',
  },
  {
    id: 'prod-6',
    name: 'Traditional Habesha Kemis (Modern Styled)',
    sku: 'NP-AP-006',
    category: 'Apparel & Crafts',
    price: 4500.00,
    cost: 2200.00,
    stock: 8,
    minStock: 3,
    unit: 'pcs',
    taxType: 'VAT',
  },
  {
    id: 'prod-7',
    name: 'Traditional Berbere Spice Blend',
    sku: 'NP-SP-007',
    category: 'Grains & Snacks',
    price: 280.00,
    cost: 190.00,
    stock: 80,
    minStock: 15,
    unit: 'kg',
    taxType: 'TOT_2',
  },
  {
    id: 'prod-8',
    name: 'Shiro Powder (Pre-mixed Compound)',
    sku: 'NP-SP-008',
    category: 'Grains & Snacks',
    price: 210.00,
    cost: 140.00,
    stock: 95,
    minStock: 20,
    unit: 'kg',
    taxType: 'TOT_2',
  },
  {
    id: 'prod-9',
    name: 'Soft Drink (Ambo Mineral Water 350ml)',
    sku: 'NP-DR-009',
    category: 'Prepared Food & Drinks',
    price: 35.00,
    cost: 18.00,
    stock: 14, // low stock to trigger inventory warning
    minStock: 25,
    unit: 'pcs',
    taxType: 'VAT',
  },
  {
    id: 'prod-10',
    name: 'Woven Coffee Cup Coasters (Traditional)',
    sku: 'NP-AP-010',
    category: 'Apparel & Crafts',
    price: 180.00,
    cost: 90.00,
    stock: 35,
    minStock: 5,
    unit: 'pcs',
    taxType: 'TOT_2',
  }
];

export const HistoricalOrders: Order[] = [
  {
    id: 'ord-1',
    invoiceNo: 'NP-2026-0491',
    timestamp: '2026-05-31T10:15:00Z',
    items: [
      { product: InitialProducts[1], quantity: 2 }, // Coffee = 640 ETB
      { product: InitialProducts[4], quantity: 1 }, // Injera = 150 ETB
    ],
    subtotal: 790.00,
    taxAmount: 99.00, // Coffee is VAT 15% -> 96 ETB; Injera is TOT 2% -> 3 ETB. Subtotal = 790, total = 889
    total: 889.00,
    paymentMethod: 'Telebirr',
    isSynced: true,
    notes: 'Sold to regular customer',
  },
  {
    id: 'ord-2',
    invoiceNo: 'NP-2026-0492',
    timestamp: '2026-05-31T11:42:00Z',
    items: [
      { product: InitialProducts[2], quantity: 10 }, // Teff = 1250 ETB (Exempt)
      { product: InitialProducts[7], quantity: 1 }, // Shiro = 210 ETB (TOT 2% -> 4.2 ETB)
    ],
    subtotal: 1460.00,
    taxAmount: 4.20,
    total: 1464.20,
    paymentMethod: 'CBE Birr',
    isSynced: true,
  },
  {
    id: 'ord-3',
    invoiceNo: 'NP-2026-0493',
    timestamp: '2026-05-31T14:30:00Z',
    items: [
      { product: InitialProducts[5], quantity: 1 }, // Dress = 4500 ETB (VAT 15% -> 675 ETB)
    ],
    subtotal: 4500.00,
    taxAmount: 675.00,
    total: 5175.00,
    paymentMethod: 'Cash',
    isSynced: true,
    notes: 'Mercato Boutique branch sale',
  }
];
