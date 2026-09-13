/**
 * Gripwellolated Mock Datasets
 * Reflects exact consignments and ledger states in Stitch screens.
 */

import { Consignment, KPISummary } from "../../types/models";

export const INITIAL_KPIS: KPISummary = {
  invoicedCargo: 24100,
  invoicedCount: 3,
  collectedAmount: 15600,
  collectedDescription: "Settled via Cash & UPI",
  outstandingCredit: 8500,
  outstandingDescription: "1 consignment on Net-15",
  advancePoolAmount: 5000,
  advancePoolSource: "KK Stores (ADV-1)",
};

export const INITIAL_CONSIGNMENTS: Consignment[] = [
  {
    id: "#1091",
    loadSequence: "202410240001",
    dockNumber: "Dock 03",
    driverName: "S. Kumar",
    driverPhone: "+91 94432 18742",
    vehicleNumber: "TN 01 AB 8812",
    customerName: "Sri Murugan Traders",
    referenceNumber: "REF-2024-SM01",
    itemsSummary: "Plastic Chair (50), Crate 20L (30)",
    status: "settled",
    grossTotal: 15600,
    availableAdvance: 0,
    appliedAdvance: 0,
    netPayable: 15600,
    selectedPaymentMode: "cash",
    dispatchTime: "Today 08:30 AM",
    items: [
      {
        id: "li-1",
        description: "Plastic Chair Standard",
        sku: "PL-CHR-STD50",
        unit: "Units",
        quantity: 50,
        unitPrice: 180,
        total: 9000,
        packaging: "Carton (5 × 10)",
      },
      {
        id: "li-2",
        description: "Crate 20L Heavy Duty",
        sku: "CRT-20L-HD30",
        unit: "Units",
        quantity: 30,
        unitPrice: 220,
        total: 6600,
        packaging: "Palletized",
      },
    ],
  },
  {
    id: "#1092",
    loadSequence: "202410240002",
    dockNumber: "Dock 01",
    driverName: "R. Pandian",
    driverPhone: "+91 98450 01122",
    vehicleNumber: "TN 22 CD 5678",
    customerName: "KK Stores",
    referenceNumber: "REF-2024-KK02",
    itemsSummary: "Plastic Table Heavy (10 units)",
    status: "calibrating",
    grossTotal: 8500,
    availableAdvance: 5000,
    appliedAdvance: 5000,
    advanceVoucherId: "ADV-1",
    netPayable: 3500,
    selectedPaymentMode: "credit",
    dispatchTime: "Today 11:30 AM",
    items: [
      {
        id: "li-3",
        description: "Plastic Table (Heavy Mold)",
        sku: "PL-TBL-HM10",
        unit: "Units",
        quantity: 10,
        unitPrice: 850,
        total: 8500,
        packaging: "Shrink-wrapped",
      },
    ],
  },
  {
    id: "#1093",
    loadSequence: "202410240003",
    dockNumber: "Dock 05",
    driverName: "Murugan",
    driverPhone: "+91 99443 32211",
    vehicleNumber: "TN 11 EF 9090",
    customerName: "Anbu Furniture",
    referenceNumber: "REF-2024-AF03",
    itemsSummary: "Crate 10L Standard (100 units)",
    status: "uncalibrated",
    grossTotal: 0,
    availableAdvance: 0,
    appliedAdvance: 0,
    netPayable: 0,
    selectedPaymentMode: "cash",
    dispatchTime: "Today 02:00 PM",
    items: [
      {
        id: "li-4",
        description: "Crate 10L Standard",
        sku: "CRT-10L-STD100",
        unit: "Units",
        quantity: 100,
        unitPrice: 0,
        total: 0,
        packaging: "Strapped Bundle",
      },
    ],
  },
];

export const INITIAL_OWNER_KPIS: import("../../types/models").OwnerFiscalKPI = {
  validLoadsToday: 3,
  validLoadsDescription: "100% routed consignments",
  collectedRevenue: 15600,
  collectedDescription: "Cash: ₹10,000 · UPI: ₹5,600",
  paymentPending: 9500,
  paymentPendingDescription: "1 load · Dock Gate Sync",
  creditOutstanding: 8500,
  creditOutstandingDescription: "KK Stores · 3 Days Overdue",
};

export const INITIAL_CREDIT_ACCOUNTS: import("../../types/models").CreditAccount[] =
  [
    {
      id: "ca-1",
      accountNumber: "CS-4402",
      customerName: "KK Stores Pvt Ltd",
      driverName: "Selvam",
      vehicleNumber: "KA-01-E-9912",
      terms: "Net-15",
      dueDescription: "3 Days Overdue",
      isOverdue: true,
      netDue: 8500,
      isFrozen: false,
    },
    {
      id: "ca-2",
      accountNumber: "CS-7819",
      customerName: "Sri Laxmi Plastics",
      driverName: "Ramesh K",
      vehicleNumber: "MH-04-F-3240",
      terms: "Net-30",
      dueDescription: "Due in 4 days",
      isOverdue: false,
      netDue: 8200,
      isFrozen: false,
    },
  ];

export const INITIAL_RECONCILIATION_RECORDS: import("../../types/models").ReconciliationRecord[] =
  [
    {
      id: "rec-1",
      loadSequence: "202410240842",
      dispatchTime: "08:42 AM",
      customerName: "Bhavani Grocers",
      manifestSummary: "120 Bales Agro Cotton, Grade-A",
      value: 10000,
      paymentMode: "Cash Safe #2",
      status: "Paid",
    },
    {
      id: "rec-2",
      loadSequence: "202410241115",
      dispatchTime: "11:15 AM",
      customerName: "Deccan Spices Corp",
      manifestSummary: "45 Drums Cold-Pressed Oils",
      value: 5600,
      paymentMode: "UPI / 709218",
      status: "Paid",
    },
    {
      id: "rec-3",
      loadSequence: "202410241420",
      dispatchTime: "02:20 PM",
      customerName: "Apex Agri Impex",
      manifestSummary: "80 Bags Raw Coffee Beans",
      value: 9500,
      paymentMode: "Dock Gate Sync",
      status: "Pending",
    },
  ];
