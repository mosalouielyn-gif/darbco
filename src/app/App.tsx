import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { Login } from "./components/login";
import { ProductionClerkDashboard } from "./components/dashboards/production-clerk";
import { InventoryBookkeeperDashboard } from "./components/dashboards/inventory-bookkeeper";
import { PayrollPersonnelDashboard } from "./components/dashboards/payroll-personnel";
import { FinanceOfficerDashboard } from "./components/dashboards/finance-officer";
import { ManagerAdminDashboard } from "./components/dashboards/manager-admin";
import { User } from "./components/types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => setUser(null);

  return (
    <>
      <Toaster position="top-right" richColors />
      {!user && <Login onLogin={setUser} />}
      {user?.role === "production_clerk" && <ProductionClerkDashboard user={user} onLogout={handleLogout} />}
      {user?.role === "inventory_bookkeeper" && <InventoryBookkeeperDashboard user={user} onLogout={handleLogout} />}
      {user?.role === "payroll_personnel" && <PayrollPersonnelDashboard user={user} onLogout={handleLogout} />}
      {user?.role === "finance_officer" && <FinanceOfficerDashboard user={user} onLogout={handleLogout} />}
      {user?.role === "manager_admin" && <ManagerAdminDashboard user={user} onLogout={handleLogout} />}
    </>
  );
}
