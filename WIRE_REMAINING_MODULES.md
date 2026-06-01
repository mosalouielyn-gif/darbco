# Complete Database Integration Guide

## ✅ Already Wired

- **Inventory Bookkeeper**
  - ✅ Inventory Items (CRUD)
  - ✅ Stock History (Read with filters)
  - ✅ Credit Transactions (Read + View/Print receipts)

## 🔧 To Wire - Step by Step

### Production Clerk

#### 1. Pass User Context

```typescript
// In ProductionClerkDashboard component
export function ProductionClerkDashboard({ user, onLogout }: Props) {
  const [active, setActive] = useState("dashboard");
  return (
    <DarbcoLayout user={user} onLogout={onLogout} navItems={NAV} active={active} onChange={setActive}>
      {active === "dashboard" && <Dashboard user={user} />}
      {active === "production" && <ProductionPanel user={user} />}
    </DarbcoLayout>
  );
}
```

#### 2. ARB Logs - Wire Save

```typescript
// In NewArbLogDialog, add handleSave function:
const handleSave = async () => {
  if (!packingDate) {
    toast.error("Packing date is required");
    return;
  }
  if (rows.some(r => !r.beneficiary)) {
    toast.error("Beneficiary is required for each row");
    return;
  }

  try {
    for (const row of rows) {
      // Look up beneficiary ID from name
      const beneficiaries = await fetchBeneficiaries();
      const beneficiary = beneficiaries.find(
        b => b.full_name.toLowerCase() === row.beneficiary.toLowerCase()
      );
      
      if (!beneficiary) {
        toast.error(`Beneficiary not found: ${row.beneficiary}`);
        continue;
      }

      await createArbLog({
        packing_date: packingDate,
        beneficiary_id: beneficiary.id,
        block_no: row.blk || undefined,
        recorded_by: parseInt(user.id),
        carreros: row.carreros.map(c => ({
          carrero_name: c.name,
          time_arrival: c.time || undefined,
          w11: parseInt(c.w11) || 0,
          w12: parseInt(c.w12) || 0,
          w13: parseInt(c.w13) || 0,
          w14: parseInt(c.w14) || 0,
        })),
      });
    }
    toast.success("ARB logs saved!");
    onOpenChange(false);
  } catch (error) {
    toast.error("Failed to save ARB logs");
    console.error(error);
  }
};

// Replace the Save button onClick:
<Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
  <Save className="h-4 w-4 mr-1" />Save Record
</Button>
```

#### 3. Daily Boxes - Wire Save

```typescript
// In NewDailyBoxesDialog:
const handleSave = async () => {
  try {
    await createDailyBoxes({
      packing_date: packingDate,
      first_box_at: firstBox || undefined,
      last_box_at: lastBox || undefined,
      class_a_total: classA.reduce((sum, v) => sum + (parseInt(v) || 0), 0),
      class_b_total: classB.reduce((sum, v) => sum + (parseInt(v) || 0), 0),
      special_total: parseInt(special) || 0,
      recorded_by: parseInt(user.id),
    });
    toast.success("Daily boxes saved!");
    onOpenChange(false);
  } catch (error) {
    toast.error("Failed to save daily boxes");
    console.error(error);
  }
};
```

#### 4. Daily Production Per Beneficiary - Wire Save

```typescript
// In NewDailyPerBeneficiaryDialog:
const handleSave = async () => {
  if (rows.some(r => !r.name)) {
    toast.error("Beneficiary name is required for each row");
    return;
  }

  try {
    const beneficiaries = await fetchBeneficiaries();
    
    for (const row of rows) {
      const beneficiary = beneficiaries.find(
        b => b.full_name.toLowerCase() === row.name.toLowerCase()
      );
      
      if (!beneficiary) {
        toast.error(`Beneficiary not found: ${row.name}`);
        continue;
      }

      await createProductionRecord({
        packing_date: packingDate,
        beneficiary_id: beneficiary.id,
        sub_code: row.sub || undefined,
        stems_cut: parseInt(row.stems) || 0,
        class_a_hands: parseInt(row.hands) || 0,
        class_a_sh: parseInt(row.sh) || 0,
        class_a_fp: parseInt(row.fp) || 0,
        class_b_clb: parseInt(row.clb) || 0,
        class_b_h: parseInt(row.h) || 0,
        class_b_i: parseInt(row.i) || 0,
        class_b_d: parseInt(row.d) || 0,
        recorded_by: parseInt(user.id),
      });
    }
    toast.success("Production records saved!");
    onOpenChange(false);
  } catch (error) {
    toast.error("Failed to save production records");
    console.error(error);
  }
};
```

### Inventory Bookkeeper - Release Materials

```typescript
// In ReleaseMaterials component, wire the save:
const handleSave = async () => {
  if (!material || !quantity || !beneficiary) {
    toast.error("All fields are required");
    return;
  }

  try {
    const items = await fetchInventory();
    const item = items.find(i => i.item_name === material);
    if (!item) {
      toast.error("Material not found");
      return;
    }

    const beneficiaries = await fetchBeneficiaries();
    const ben = beneficiaries.find(
      b => b.full_name.toLowerCase() === beneficiary.toLowerCase()
    );
    if (!ben) {
      toast.error("Beneficiary not found");
      return;
    }

    // Determine transaction type
    const txnType = type === "credit" ? "Credit Issued" : "Cash Purchase";

    await createStockTransaction({
      reference_no: slipNo,  // Auto-generate this
      txn_type: txnType,
      item_id: item.id,
      quantity: -parseFloat(quantity), // Negative for release
      unit_cost: item.unit_cost,
      beneficiary_id: ben.id,
      reason: notes || undefined,
      recorded_by: parseInt(user.id),
    });

    // If credit, also create credit balance
    if (type === "credit") {
      await createCredit({
        receipt_no: slipNo,
        beneficiary_id: ben.id,
        item_id: item.id,
        quantity: parseFloat(quantity),
        unit_cost: item.unit_cost,
        issued_by: parseInt(user.id),
      });
    }

    toast.success(`Material ${type === "credit" ? "released on credit" : "sold"}!`);
    // Clear form
  } catch (error) {
    toast.error("Failed to release material");
    console.error(error);
  }
};
```

### Payroll Personnel

#### Wire Payroll Creation

```typescript
// In PayrollPersonnelDashboard, when creating payroll batch:
const handleCreateBatch = async (data) => {
  try {
    await createPayrollBatch({
      batch_no: data.batchNo,
      period_start: data.periodStart,
      period_end: data.periodEnd,
      prepared_by: parseInt(user.id),
      slips: data.slips.map(slip => ({
        beneficiary_id: slip.beneficiary_id,
        gross_amount: slip.grossAmount,
        credit_deduction: slip.creditDeduction,
        net_amount: slip.netAmount,
      })),
    });
    toast.success("Payroll batch created!");
    loadPayroll(); // Reload list
  } catch (error) {
    toast.error("Failed to create payroll batch");
    console.error(error);
  }
};
```

#### Wire Payroll Approval

```typescript
// In Manager/Admin, when approving payroll:
const handleApprovePayroll = async (batchId) => {
  try {
    await updatePayrollStatus(batchId, {
      status: "Approved",
      approved_by: parseInt(user.id),
    });
    toast.success("Payroll approved!");
    loadPayroll();
  } catch (error) {
    toast.error("Failed to approve payroll");
    console.error(error);
  }
};
```

### Manager/Admin - User Management

```typescript
// Load users
const loadUsers = async () => {
  try {
    const users = await fetchUsers();
    setUserData(users);
  } catch (error) {
    toast.error("Failed to load users");
  }
};

// Create user
const handleCreateUser = async (formData) => {
  try {
    await createUser({
      full_name: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
    toast.success("User created!");
    loadUsers();
  } catch (error) {
    toast.error("Failed to create user");
  }
};

// Update user
const handleUpdateUser = async (userId, formData) => {
  try {
    await updateUser(userId, {
      full_name: formData.fullName,
      email: formData.email,
      role: formData.role,
      // Only include password if changed
      ...(formData.password ? { password: formData.password } : {}),
    });
    toast.success("User updated!");
    loadUsers();
  } catch (error) {
    toast.error("Failed to update user");
  }
};

// Deactivate user
const handleDeactivateUser = async (userId) => {
  try {
    await deactivateUser(userId);
    toast.success("User deactivated!");
    loadUsers();
  } catch (error) {
    toast.error("Failed to deactivate user");
  }
};
```

## 🎯 Priority Order

1. **Production Clerk ARB Logs** ← Most critical
2. **Production Clerk Daily Boxes**
3. **Release Materials** (creates stock transactions + credits)
4. **Payroll Creation & Approval**
5. **User Management**

## 📋 Pattern Summary

For every "Save" action:

1. **Add `user` prop** to component (get from parent)
2. **Validate form data**
3. **Look up IDs** (beneficiaries, items, etc.) from names if needed
4. **Call API helper** with `recorded_by: parseInt(user.id)`
5. **Show toast** on success/error
6. **Reload data** or close dialog

## 🚀 Testing Checklist

After wiring each feature:

- [ ] Save action shows loading state
- [ ] Success toast appears
- [ ] Data appears in phpMyAdmin table
- [ ] Page refresh shows persisted data
- [ ] Validation errors show helpful messages
- [ ] User ID is recorded in database

---

**All API helpers are ready in `/src/app/lib/db-helpers.ts`** — just need to call them from the UI components!
