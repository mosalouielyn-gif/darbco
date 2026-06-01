export type Role =
  | "production_clerk"
  | "inventory_bookkeeper"
  | "payroll_personnel"
  | "finance_officer"
  | "manager_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const ROLE_LABELS: Record<Role, string> = {
  production_clerk: "Production Clerk",
  inventory_bookkeeper: "Inventory Bookkeeper",
  payroll_personnel: "Payroll Personnel",
  finance_officer: "Finance Officer",
  manager_admin: "Manager / Admin",
};

// Development-only accounts — match database/darbco.sql test users
export const DEV_ACCOUNTS: Record<string, { password: string; user: User }> = {
  "admin@darbco.local": {
    password: "password",
    user: { id: "1", name: "DARBCO Administrator", email: "admin@darbco.local", role: "manager_admin" },
  },
  "production@darbco.local": {
    password: "password",
    user: { id: "2", name: "Production Clerk", email: "production@darbco.local", role: "production_clerk" },
  },
  "inventory@darbco.local": {
    password: "password",
    user: { id: "3", name: "Inventory Bookkeeper", email: "inventory@darbco.local", role: "inventory_bookkeeper" },
  },
  "payroll@darbco.local": {
    password: "password",
    user: { id: "4", name: "Payroll Personnel", email: "payroll@darbco.local", role: "payroll_personnel" },
  },
  "finance@darbco.local": {
    password: "password",
    user: { id: "5", name: "Finance Officer", email: "finance@darbco.local", role: "finance_officer" },
  },
};

export const BENEFICIARIES = [
  "B-001 — Roberto Cruz",
  "B-002 — Liza Mariano",
  "B-003 — Antonio Villanueva",
  "B-004 — Helena Pascual",
  "B-005 — Ferdinand Lopez",
  "B-006 — Gloria Santos",
  "B-007 — Manuel Tan",
  "B-008 — Beatrice Ong",
];
