# DARBCO Database Integration Guide

## ✅ What's Been Wired

### Inventory Bookkeeper Module

#### 📦 Inventory Items
- **Fetch**: Loads all inventory items from database on component mount
- **Create**: `+ Add Item` saves new items to `inventory_items` table
  - Auto-generates Material ID (FERT-001, CHEM-002, etc.)
  - Validates required fields
  - Supports multiple items in one batch
- **Update**: Edit button saves changes to database
  - Updates item name, unit, cost, dates
  - On Hand quantity remains read-only (changed via stock transactions)
- **Delete**: Delete button either:
  - **Hard deletes** if no transaction history
  - **Soft deletes** (marks inactive) if item has transactions

#### 📋 Stock History / Audit Trail
- **Fetch**: Loads all stock transactions with filters
- **Filters**: Date range, transaction type, material
- **Read-only**: No edits allowed (preserves audit trail)

#### 💳 Credit Transactions
- **Fetch**: Loads all credit balances from database
- **View/Print**: Receipt dialog with printable format

### API Integration Layer

Created `/src/app/lib/db-helpers.ts` with typed functions:

```typescript
// Inventory
fetchInventory()              → GET /api/inventory
createInventoryItem(data)     → POST /api/inventory
updateInventoryItem(id, data) → PUT /api/inventory?id=
deleteInventoryItem(id)       → DELETE /api/inventory?id=

// Stock Transactions
fetchStockTransactions(params) → GET /api/stock-transactions
createStockTransaction(data)   → POST /api/stock-transactions

// Credits
fetchCredits()                 → GET /api/credits
createCredit(data)             → POST /api/credits
updateCredit(id, data)         → PUT /api/credits?id=
```

## 🔄 Data Flow

```
User Action → React Component → db-helpers → API → Node.js Server → MySQL → Response
                                 ↓
                            Updates UI State
```

### Example: Adding Inventory Item

1. User fills form in `AddInventoryItem` component
2. Clicks "Save Item"
3. `handleSave()` calls `apiCreateInventoryItem()`
4. Sends POST to `http://localhost:3001/api/inventory`
5. Server inserts into `inventory_items` table
6. Returns `{ id, material_id }`
7. Component shows success toast and reloads inventory list

## 📊 Database Tables Used

| Feature | Table(s) |
|---------|----------|
| Inventory Items | `inventory_items`, `inventory_categories` |
| Stock History | `stock_transactions`, `inventory_items`, `beneficiaries`, `users` |
| Credits | `credit_balances`, `beneficiaries`, `inventory_items`, `users` |
| Release Materials | `stock_transactions` (type: 'Cash Purchase' or 'Credit Issued') |

## 🚀 Testing the Integration

### 1. Start Everything

```powershell
# Terminal 1: Start MySQL (XAMPP)
# Open XAMPP Control Panel → Start MySQL

# Terminal 2: Start Node.js backend
cd server
npm run dev

# Terminal 3: Start React frontend
npm run dev
```

### 2. Test Inventory Items

1. Login as `inventory@darbco.local` / `password`
2. Go to **Inventory Items**
3. Click **+ Add Item**
4. Fill in:
   - Date Received: Today
   - Item Name: Test Material
   - Category: Fertilizers & Soil Inputs
   - Qty: 100
   - Unit: kg
   - Cost: 50.00
5. Click **Save Item**
6. Check phpMyAdmin → `darbco.inventory_items` → should see new row
7. Refresh the page → item should still be there (persisted)

### 3. Test Edit

1. Click Edit (blue pencil icon) on any item
2. Change the name
3. Click **Save Changes**
4. Check phpMyAdmin → row should be updated

### 4. Test Delete

1. Click Delete (red trash icon) on an item
2. Confirm deletion
3. Check phpMyAdmin:
   - If item has no transactions → row deleted
   - If item has transactions → `is_active` = 0

## 🔧 Troubleshooting

### "Failed to load inventory"
- ✅ Check backend is running: `http://localhost:3001/`
- ✅ Check database is running: XAMPP → MySQL green
- ✅ Check `.env` has `VITE_API_URL=http://localhost:3001/api`
- ✅ Check `/server/.env` has correct DB credentials

### "Failed to add inventory item"
- ✅ Open browser DevTools → Console → check error message
- ✅ Check server terminal for errors
- ✅ Verify table exists: phpMyAdmin → `darbco.inventory_items`

### Items not persisting after refresh
- ✅ Check if `apiCreateInventoryItem()` succeeded (no toast.error)
- ✅ Check Network tab → POST to `/api/inventory` should return 200
- ✅ Check database table directly in phpMyAdmin

## 📝 Next Steps to Complete Integration

### Still Using Hardcoded Data (Needs Wiring)

#### Inventory Bookkeeper
- [ ] **Dashboard KPIs** - should calculate from database
- [ ] **Release Materials** - save to `stock_transactions`
- [ ] **Stock History filters** - wire to API params

#### Production Clerk
- [ ] **ARB Logs** - save to `arb_logs` + `arb_log_carreros`
- [ ] **Daily Production** - save to `production_records`
- [ ] **Daily Boxes** - save to `daily_boxes`

#### Payroll Personnel
- [ ] **Payroll Batches** - save to `payroll_batches` + `payroll_slips`

#### Finance Officer
- [ ] **Finance Transactions** - save to `finance_transactions`

#### Manager/Admin
- [ ] **User Management** - CRUD operations on `users` table
- [ ] **Dashboard aggregations** - calculate from database

### How to Wire Additional Features

Follow the same pattern used for Inventory Items:

```typescript
// 1. Add useEffect to load data
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const data = await fetchYourData();
    setYourState(data);
  } catch (error) {
    toast.error("Failed to load");
  }
};

// 2. Update save handlers
const handleSave = async (formData) => {
  try {
    await apiCreateYourThing({
      ...formData,
      recorded_by: parseInt(user.id),
    });
    toast.success("Saved!");
    loadData(); // Reload
  } catch (error) {
    toast.error("Failed to save");
  }
};
```

## 🎯 Current Status

✅ **Database schema** created and imported
✅ **Backend API** fully implemented for all modules
✅ **Frontend API helpers** created with types
✅ **Login** connected to database
✅ **Inventory Items** fully CRUD-enabled
⚠️  **Other modules** still using mock data (easy to wire using same pattern)

---

Run the tests above to verify everything works! When you add an inventory item through the UI, it should appear in phpMyAdmin immediately.
