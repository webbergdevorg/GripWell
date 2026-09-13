/**
 * Gripwell - Mock Data: Credit Ledger & Customer Advances
 * Extracted directly from Google Stitch Screen 9:
 * "Credit & Advance Payments" (edd10a6def0445efb812fd869ef0800b)
 */

import {
    AdvanceDepositItem,
    CreditLedgerItem,
    CreditLedgerKPISummary,
} from "../types/models";

export const INITIAL_CREDIT_KPIS: CreditLedgerKPISummary = {
  totalCreditGiven: 8500,
  totalCreditChange: "+12% wk",
  activeDebitsCount: 2,
  totalRecovered: 0,
  recoveredPercentage: "0% recovered",
  scheduledClearance: "Immediate",
  netOutstandingCredit: 8500,
  defaultExposure: "100% of cycle",
  criticalStatus: "Critical",
  totalAdvanceBalanceHeld: 5000,
  advanceStatus: "Secured",
  unmappedPool: "₹5,000 liquid",
};

export const INITIAL_CREDIT_LOADS: CreditLedgerItem[] = [
  {
    id: "L2",
    loadNumber: "Load 2",
    customerName: "KK Stores",
    tripId: "FB-2024-0982",
    route: "Ennore to Ambattur Industrial",
    timestamp: "Today 11:30 AM",
    driverName: "Selvam",
    vehicleReg: "TN 22 CD 5678",
    particulars: "Freight & Handling Balance",
    totalCredit: 8500,
    settled: 0,
    netDue: 8500,
    statusTag: "Overdue Alert",
    availableAdvance: 5000,
  },
  {
    id: "L0",
    loadNumber: "Load 0",
    customerName: "Sri Laxmi Plastics",
    tripId: "FB-2024-0974",
    route: "Gummidipoondi to Sriperumbudur",
    timestamp: "Yesterday 04:15 PM",
    driverName: "Rajendran M",
    vehicleReg: "TN 04 AJ 9012",
    particulars: "Consignment Transit + Detention",
    totalCredit: 14200,
    settled: 6000,
    netDue: 8200,
    statusTag: "Partial Paid",
    terms: "Terms: Net 7 Days (Due in 4 days)",
  },
];

export const INITIAL_ADVANCE_DEPOSITS: AdvanceDepositItem[] = [
  {
    id: "ADV-1",
    code: "A1",
    customerName: "Sri Murugan Traders",
    mode: "UPI",
    timestamp: "Today 8:00 AM",
    status: "Pending Load",
    note: "“Advance paid before morning load”",
    totalAdvance: 5000,
    applied: 0,
    remaining: 5000,
    allocation: "Unassigned buffer",
  },
  {
    id: "ADV-2",
    code: "A2",
    customerName: "Balaji Enterprises",
    mode: "Bank Transfer (IMPS)",
    timestamp: "Yesterday",
    status: "Partially Allocated",
    totalAdvance: 12000,
    applied: 8500,
    remaining: 3500,
    allocation: "Allocated across 2 shipments",
    appliedMapping: [
      { id: "m1", title: "Load 102 • Cement Shipment", amount: 5000 },
      { id: "m2", title: "Load 104 • TMT Rebar Freight", amount: 3500 },
    ],
  },
];
