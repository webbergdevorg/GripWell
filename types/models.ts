/**
 * Gripwellgistics & Billing Domain Models
 */

export type PaymentMode = "cash" | "online" | "credit";

export type ConsignmentStatus =
  | "settled"
  | "settling"
  | "pending"
  | "credit"
  | "unsettled"
  | "staging"
  | "ready_for_seal"
  | "calibrating"
  | "uncalibrated"
  | "void";

export interface LineItem {
  id: string;
  description: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  packaging?: string;
  bayId?: string;
}

export interface AdvanceVoucher {
  id: string; // e.g. 'ADV-1'
  customerName: string;
  amount: number;
  remainingAmount: number;
  mode: PaymentMode;
  date: string;
  note?: string;
}

export interface Consignment {
  id: string; // e.g. '#1092' or 'LOAD-004'
  loadSequence: string; // e.g. '202410240004'
  dockNumber: string; // e.g. 'Dock 01'
  driverName: string; // e.g. 'R. Pandian'
  driverPhone: string; // e.g. '+91 98421 90812'
  vehicleNumber: string; // e.g. 'TN 01 AB 1234'
  customerName: string; // e.g. 'KK Stores'
  customerPhone?: string;
  referenceNumber: string; // e.g. 'REF-2024-KK02'
  itemsSummary: string; // e.g. 'Plastic Table Heavy (10 units)'
  status: ConsignmentStatus;
  items: LineItem[];
  grossTotal: number;
  availableAdvance: number;
  appliedAdvance: number;
  advanceVoucherId?: string;
  netPayable: number;
  selectedPaymentMode: PaymentMode;
  paymentProofUri?: string;
  voidReason?: string;
  dispatchTime: string;
  gatePassId?: string;
  cargoPhotoUri?: string;
  cargoPhotoFilename?: string;
  cargoPhotoSize?: string;
  sealVerified?: boolean;
  customerAddress?: string;
  driverDl?: string;
  notes?: string;
}

export interface KPISummary {
  invoicedCargo: number;
  invoicedCount: number;
  collectedAmount: number;
  collectedDescription: string;
  outstandingCredit: number;
  outstandingDescription: string;
  advancePoolAmount: number;
  advancePoolSource: string;
}

export interface CreditAccount {
  id: string;
  accountNumber: string;
  customerName: string;
  driverName: string;
  vehicleNumber: string;
  terms: string;
  dueDescription: string;
  isOverdue: boolean;
  netDue: number;
  isFrozen?: boolean;
}

export interface ReconciliationRecord {
  id: string;
  loadSequence: string;
  dispatchTime: string;
  customerName: string;
  manifestSummary: string;
  value: number;
  paymentMode: string;
  status: "Paid" | "Pending" | "Credit";
}

export interface OwnerFiscalKPI {
  validLoadsToday: number;
  validLoadsDescription: string;
  collectedRevenue: number;
  collectedDescription: string;
  paymentPending: number;
  paymentPendingDescription: string;
  creditOutstanding: number;
  creditOutstandingDescription: string;
}

export type ProductStatus = "ACTIVE" | "LOW STOCK" | "INACTIVE";

export interface ProductSKU {
  id: string;
  sku: string;
  name: string;
  category: string;
  categoryTag: string;
  status: ProductStatus;
  unitMetric: string;
  defaultBaseRate: number;
  defaultPlusRate?: number;
  minThresholdRate?: number;
  rateDisplay: string;
  secondaryRateDisplay?: string;
  warehouseStock?: number;
  warehouseStockDisplay?: string;
  stockSubtext?: string;
  hsnCode: string;
  isLowStock?: boolean;
}

export interface ProductKPISummary {
  totalSkus: number;
  totalSkusTag: string;
  rateUpdates: number;
  rateUpdatesTag: string;
  avgMargin: string;
}

export interface CreditLedgerItem {
  id: string; // e.g. 'L2', 'L0'
  loadNumber: string;
  customerName: string;
  tripId: string;
  route: string;
  timestamp: string;
  driverName: string;
  vehicleReg: string;
  particulars: string;
  totalCredit: number;
  settled: number;
  netDue: number;
  statusTag: "Overdue Alert" | "Partial Paid" | "Settled";
  availableAdvance?: number;
  terms?: string;
}

export interface AdvanceMappingEntry {
  id: string;
  title: string;
  amount: number;
}

export interface AdvanceDepositItem {
  id: string; // e.g. 'ADV-1', 'ADV-2'
  code: string; // e.g. 'A1', 'A2'
  customerName: string;
  mode: string;
  timestamp: string;
  status: "Pending Load" | "Partially Allocated" | "Fully Allocated";
  note?: string;
  totalAdvance: number;
  applied: number;
  remaining: number;
  allocation?: string;
  appliedMapping?: AdvanceMappingEntry[];
  appliedMappings?: AdvanceMappingEntry[];
  depositSlipFilename?: string;
}

export interface CreditLedgerKPISummary {
  totalCreditGiven: number;
  totalCreditChange: string;
  activeDebitsCount: number;
  totalRecovered: number;
  recoveredPercentage: string;
  scheduledClearance: string;
  netOutstandingCredit: number;
  defaultExposure: string;
  criticalStatus: string;
  totalAdvanceBalanceHeld: number;
  advanceStatus: string;
  unmappedPool: string;
}

export interface GatePassItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  packaging: string;
  bayId?: string;
}

export interface GatePass {
  id: string; // 'GP-04'
  loadSequence: string; // '202410240004'
  issueDate: string; // 'Oct 24, 2024'
  issueTime: string; // '02:45 PM'
  vehicleNumber: string; // 'TN 01 AB 1234'
  driverName: string; // 'Rajan Kumar'
  driverPhone: string; // '+91 98421 90812'
  driverDl: string; // 'DL-0420110092812'
  customerName: string; // 'Sri Murugan Traders'
  destinationHub: string; // 'Salem Hub, Yard 2'
  dockBay: string; // 'Dock Bay 3'
  securitySealNumber: string; // 'SEAL-88421-TAMPER-SAFE'
  sealVerified: boolean;
  totalPieceCount: number; // 80
  items: GatePassItem[];
  ratesMasked: boolean;
  gateStatus: "authorized" | "exited" | "held";
  exitTimestamp?: string;
  smsNotificationSent: boolean;
  qrCodeValue: string;
}
