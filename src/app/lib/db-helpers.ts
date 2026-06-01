/**
 * Database helper functions for DARBCO
 * Wraps API calls with proper error handling and user context
 */

import { api } from '../utils/api';

export interface InventoryItem {
  id: number;
  material_id: string;
  item_name: string;
  category_code: string;
  category: string;
  unit: string;
  on_hand: number;
  unit_cost: number;
  expiry_date: string | null;
  stock_date: string | null;
  is_active: boolean;
  status: 'OK' | 'Low Stock' | 'Out of Stock';
}

export interface Beneficiary {
  id: number;
  code: string;
  full_name: string;
  block_no: string | null;
  contact_no: string | null;
  address: string | null;
  is_active: boolean;
}

export interface StockTransaction {
  id: number;
  reference_no: string;
  txn_type: string;
  quantity: number;
  unit_cost: number;
  supplier_name: string | null;
  reason: string | null;
  txn_at: string;
  item_name: string;
  material_id: string;
  unit: string;
  beneficiary_code: string | null;
  beneficiary_name: string | null;
  recorded_by_name: string;
}

export interface CreditBalance {
  id: number;
  receipt_no: string;
  quantity: number;
  unit_cost: number;
  amount: number;
  remaining_balance: number;
  status: string;
  payroll_batch: string | null;
  issued_at: string;
  beneficiary_code: string;
  beneficiary_name: string;
  item_name: string;
  material_id: string;
  unit: string;
  issued_by_name: string;
}

// Inventory
export const fetchInventory = (): Promise<InventoryItem[]> =>
  api.inventory.getAll();

export const createInventoryItem = (data: {
  item_name: string;
  category_code: string;
  unit: string;
  on_hand: number;
  unit_cost: number;
  expiry_date?: string;
  stock_date?: string;
}): Promise<{ id: number; material_id: string }> =>
  api.inventory.create(data);

export const updateInventoryItem = (id: number, data: Partial<InventoryItem>): Promise<{ id: number }> =>
  api.inventory.update(id, data);

export const deleteInventoryItem = (id: number): Promise<{ id: number; soft_deleted?: boolean; deleted?: boolean }> =>
  api.inventory.delete(id);

// Beneficiaries
export const fetchBeneficiaries = (): Promise<Beneficiary[]> =>
  api.beneficiaries.getAll();

export const createBeneficiary = (data: {
  code: string;
  full_name: string;
  block_no?: string;
  contact_no?: string;
  address?: string;
}): Promise<{ id: number }> =>
  api.beneficiaries.create(data);

// Stock Transactions
export const fetchStockTransactions = (params?: {
  from?: string;
  to?: string;
  type?: string;
  item_id?: number;
}): Promise<StockTransaction[]> =>
  api.stockTransactions.getAll(params);

export const createStockTransaction = (data: {
  reference_no: string;
  txn_type: string;
  item_id: number;
  quantity: number;
  unit_cost: number;
  supplier_name?: string;
  beneficiary_id?: number;
  reason?: string;
  recorded_by: number;
}): Promise<{ id: number }> =>
  api.stockTransactions.create(data);

// Credits
export const fetchCredits = (): Promise<CreditBalance[]> =>
  api.credits.getAll();

export const createCredit = (data: {
  receipt_no: string;
  beneficiary_id: number;
  item_id: number;
  quantity: number;
  unit_cost: number;
  payroll_batch?: string;
  issued_by: number;
}): Promise<{ id: number; amount: number }> =>
  api.credits.create(data);

export const updateCredit = (id: number, data: {
  remaining_balance?: number;
  status?: string;
  payroll_batch?: string;
}): Promise<{ id: number }> =>
  api.credits.update(id, data);

// Production
export const fetchProduction = (from?: string, to?: string) =>
  api.production.getAll(from, to);

export const createProductionRecord = (data: {
  record_no?: string;
  harvest_date?: string;
  packing_date: string;
  beneficiary_id: number;
  harvester_name?: string;
  sub_code?: string;
  stems_cut?: number;
  buligs_total?: number;
  buligs_11w?: number;
  buligs_12w?: number;
  buligs_13w?: number;
  buligs_14w?: number;
  class_a_hands?: number;
  class_a_big_hands?: number;
  class_a_small_hands?: number;
  class_a_cps?: number;
  class_a_sh?: number;
  class_a_fp?: number;
  class_b_total?: number;
  class_b_big_hands?: number;
  class_b_small_hands?: number;
  class_b_cps?: number;
  class_b_clb?: number;
  class_b_h?: number;
  class_b_i?: number;
  class_b_d?: number;
  special_total?: number;
  defects_11w?: number;
  defects_12w?: number;
  defects_13w?: number;
  defects_14w?: number;
  rejects_11w?: number;
  rejects_12w?: number;
  rejects_13w?: number;
  rejects_14w?: number;
  status?: string;
  recorded_by: number;
}) => api.production.create(data);

// Daily Boxes
export const fetchDailyBoxes = () => api.dailyBoxes.getAll();

export const createDailyBoxes = (data: {
  packing_date: string;
  first_box_at?: string;
  last_box_at?: string;
  class_a_total?: number;
  class_b_total?: number;
  special_total?: number;
  recorded_by: number;
}) => api.dailyBoxes.create(data);

// ARB Logs
export const fetchArbLogs = () => api.arbLogs.getAll();

export const createArbLog = (data: {
  packing_date: string;
  beneficiary_id: number;
  block_no?: string;
  recorded_by: number;
  carreros: Array<{
    carrero_name: string;
    time_arrival?: string;
    w11?: number;
    w12?: number;
    w13?: number;
    w14?: number;
  }>;
}) => api.arbLogs.create(data);

// Payroll
export const fetchPayroll = () => api.payroll.getAll();

export const createPayrollBatch = (data: {
  batch_no: string;
  period_start: string;
  period_end: string;
  prepared_by: number;
  slips: Array<{
    slip_no?: string;
    beneficiary_id: number;
    production_record_id?: number;
    payroll_period?: string;
    harvest_date?: string;
    class_a_boxes?: number;
    class_b_boxes?: number;
    special_boxes?: number;
    class_a_price?: number;
    class_b_price?: number;
    special_price?: number;
    material_deduction?: number;
    previous_balance?: number;
    labor_cost?: number;
    other_deductions?: number;
    gross_amount: number;
    credit_deduction: number;
    total_deductions?: number;
    net_amount: number;
  }>;
}) => api.payroll.create(data);

export const updatePayrollStatus = (id: number, data: {
  status: string;
  approved_by?: number;
  validated_by?: number;
  return_reason?: string;
}) => api.payroll.update(id, data);

// Users
export const fetchUsers = () => api.users.getAll();

export const createUser = (data: {
  full_name: string;
  username: string;
  email: string;
  password: string;
  role: string;
}) => api.users.create(data);

export const updateUser = (id: number, data: {
  full_name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}) => api.users.update(id, data);

export const deactivateUser = (id: number) => api.users.delete(id);
