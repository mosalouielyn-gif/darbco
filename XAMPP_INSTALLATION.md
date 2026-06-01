# XAMPP Installation Guide for DARBCO

Complete guide to install and run DARBCO using XAMPP and phpMyAdmin.

---

## Why Use XAMPP?

XAMPP is **easier** than standalone MySQL because:
- ✅ Includes MySQL, phpMyAdmin, and Apache in one package
- ✅ No command-line MySQL needed
- ✅ Visual interface (phpMyAdmin) for database management
- ✅ One-click start/stop
- ✅ No password setup required by default

---

## Part 1: Install Prerequisites

### Step 1.1: Install Node.js

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (Long Term Support)
   - Choose for your operating system:
     - Windows: Download `.msi` installer
     - Mac: Download `.pkg` installer

2. **Install Node.js**
   - Windows: Run the `.msi` file, click "Next" through the installer
   - Mac: Run the `.pkg` file, follow the installer

3. **Verify Installation**
   - Open Command Prompt (Windows) or Terminal (Mac)
   - Type:
   ```bash
   node --version
   ```
   Should show: `v18.x.x` or higher
   
   ```bash
   npm --version
   ```
   Should show: `9.x.x` or higher

### Step 1.2: Install XAMPP

1. **Download XAMPP**
   - Go to: https://www.apachefriends.org/
   - Download XAMPP for your operating system
   - Choose the latest version (8.0 or higher)

2. **Install XAMPP**
   
   **Windows:**
   - Run the installer
   - Install to: `C:\xampp` (default)
   - You can uncheck Apache if you only need MySQL
   - Complete the installation

   **Mac:**
   - Open the `.dmg` file
   - Drag XAMPP to Applications
   - Open XAMPP from Applications

3. **Start XAMPP**

   **Windows:**
   - Open "XAMPP Control Panel" from Start Menu
   - Click "Start" next to **MySQL**
   - MySQL status should turn green

   **Mac:**
   - Open XAMPP Manager
   - Click "Start" on MySQL
   - Should show "Running"

4. **Verify XAMPP is Running**
   - Open your web browser
   - Go to: **http://localhost/phpmyadmin**
   - You should see the phpMyAdmin interface

---

## Part 2: Get the DARBCO Project

### Step 2.1: Download the Project

Extract the DARBCO files to a folder on your laptop:
- Windows example: `C:\Users\YourName\Documents\darbco`
- Mac example: `/Users/YourName/Documents/darbco`

### Step 2.2: Open Command Prompt/Terminal in Project Folder

**Windows:**
1. Open File Explorer
2. Navigate to the DARBCO folder
3. In the address bar, type `cmd` and press Enter

**Mac:**
1. Open Finder
2. Navigate to the DARBCO folder
3. Right-click → Services → New Terminal at Folder

### Step 2.3: Verify You're in the Right Folder

```bash
# Windows
dir

# Mac
ls
```

You should see:
- `package.json`
- `server/` folder
- `database/` folder
- `src/` folder

---

## Part 3: Install Dependencies

Run this command:

```bash
npm run install:all
```

Wait for it to complete (2-5 minutes). You should see:
```
added 500+ packages
```

---

## Part 4: Set Up Database in phpMyAdmin

### Step 4.1: Open phpMyAdmin

1. Make sure XAMPP MySQL is running (green in XAMPP Control Panel)
2. Open browser to: **http://localhost/phpmyadmin**
3. You should see the phpMyAdmin interface

### Step 4.2: Create the Database

1. Click on **"New"** in the left sidebar
2. In "Database name" field, type: `darbco`
3. In "Collation" dropdown, select: `utf8mb4_general_ci`
4. Click **"Create"**

You should see `darbco` appear in the left sidebar.

### Step 4.3: Import the Database Schema

1. **Click on `darbco`** in the left sidebar (to select it)
2. Click the **"Import"** tab at the top
3. Click **"Choose File"** button
4. Navigate to your DARBCO folder
5. Go into the `database` folder
6. Select the file: **`darbco.sql`**
7. Click **"Open"**
8. Scroll down and click **"Import"** button at the bottom

**Wait for the import to complete** (10-30 seconds)

You should see: 
```
✓ Import has been successfully finished
✓ 14 queries executed
```

### Step 4.4: Verify Tables Were Created

1. In phpMyAdmin, click on `darbco` in the left sidebar
2. You should see **14 tables**:

```
arb_log_carreros
arb_logs
audit_logs
beneficiaries
credit_balances
daily_boxes
finance_transactions
inventory_categories
inventory_items
payroll_batches
payroll_slips
production_records
restock_requests
roles
stock_transactions
users
```

### Step 4.5: Verify Test Users

1. In phpMyAdmin, click on the **`users`** table
2. Click the **"Browse"** tab
3. You should see **5 users**:

| email | full_name |
|-------|-----------|
| admin@darbco.local | DARBCO Administrator |
| production@darbco.local | Production Clerk |
| inventory@darbco.local | Inventory Bookkeeper |
| payroll@darbco.local | Payroll Personnel |
| finance@darbco.local | Finance Officer |

### Step 4.6: Verify Beneficiaries

1. Click on the **`beneficiaries`** table
2. Click the **"Browse"** tab
3. You should see **8 beneficiaries**:

```
B-001 — Roberto Cruz
B-002 — Liza Mariano
B-003 — Antonio Villanueva
B-004 — Helena Pascual
B-005 — Ferdinand Lopez
B-006 — Gloria Santos
B-007 — Manuel Tan
B-008 — Beatrice Ong
```

---

## Part 5: Configure the Backend

### Step 5.1: Create Environment File

In your terminal (still in DARBCO folder):

**Windows:**
```bash
copy server\.env.example server\.env
```

**Mac:**
```bash
cp server/.env.example server/.env
```

### Step 5.2: Edit the Environment File

**Windows:**
```bash
notepad server\.env
```

**Mac:**
```bash
open -e server/.env
```

### Step 5.3: Configure for XAMPP

The file will look like this:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=
PORT=3001
NODE_ENV=development
```

**For XAMPP, the default settings work perfectly!**

**Important XAMPP Settings:**
- `DB_HOST=127.0.0.1` ✅ Keep as is (or use `localhost`)
- `DB_PORT=3306` ✅ Keep as is (XAMPP default MySQL port)
- `DB_NAME=darbco` ✅ Keep as is (database we created)
- `DB_USER=root` ✅ Keep as is (XAMPP default user)
- `DB_PASS=` ✅ **Leave EMPTY** (XAMPP has no password by default)

**Only change `DB_PASS` if you set a password in XAMPP!**

Save the file and close it.

---

## Part 6: Run the Application

### Step 6.1: Make Sure XAMPP MySQL is Running

Check XAMPP Control Panel:
- **MySQL** should be **green/running**
- If not, click "Start" next to MySQL

### Step 6.2: Start DARBCO

In your terminal (DARBCO folder):

```bash
npm run dev
```

**Expected output:**
```
[server] ✓ DARBCO Server running on http://localhost:3001
[server] ✓ Environment: development
[server] ✓ Database: darbco
[client] VITE ready in 500ms
[client] ➜ Local: http://localhost:5173/
```

### Step 6.3: Open the Application

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the DARBCO login page

### Step 6.4: Log In

Use any of these test accounts:

**Manager/Admin (Full Access):**
- Email: `admin@darbco.local`
- Password: `password`

**Production Clerk:**
- Email: `production@darbco.local`
- Password: `password`

**Inventory Bookkeeper:**
- Email: `inventory@darbco.local`
- Password: `password`

**Payroll Personnel:**
- Email: `payroll@darbco.local`
- Password: `password`

**Finance Officer:**
- Email: `finance@darbco.local`
- Password: `password`

---

## Part 7: Using phpMyAdmin to Manage Database

### 7.1: Access phpMyAdmin

While DARBCO is running:
- Open: **http://localhost/phpmyadmin**
- Click on `darbco` database in sidebar
- You can view all tables and data

### 7.2: View Data

**To view data in any table:**
1. Click the table name (e.g., `beneficiaries`)
2. Click **"Browse"** tab
3. You'll see all records in that table

**To search:**
1. Click the table
2. Click **"Search"** tab
3. Enter search criteria

### 7.3: Add Data Manually (Optional)

**To add a new beneficiary:**
1. Click `beneficiaries` table
2. Click **"Insert"** tab
3. Fill in the form:
   - code: `B-009`
   - full_name: `Juan Dela Cruz`
   - block_no: `Block 3`
   - contact_no: `09123456789`
   - address: `Panabo City`
4. Click **"Go"**

**To add inventory items:**
1. Click `inventory_items` table
2. Click **"Insert"** tab
3. Fill in the form
4. Click **"Go"**

### 7.4: Export Data (Backup)

**To backup your database:**
1. Click on `darbco` in sidebar
2. Click **"Export"** tab at top
3. Choose **"Quick"** export method
4. Format: **SQL**
5. Click **"Export"**
6. Save the `.sql` file

### 7.5: Import Data (Restore)

**To restore from backup:**
1. Click on `darbco` in sidebar
2. Click **"Import"** tab
3. Choose your backup `.sql` file
4. Click **"Import"**

### 7.6: View Production Records

After you add production data in DARBCO:
1. In phpMyAdmin, click `production_records` table
2. Click **"Browse"**
3. You'll see all harvest records
4. You can search, sort, and filter

### 7.7: View Payroll Data

After processing payroll in DARBCO:
1. Click `payroll_batches` table to see payroll periods
2. Click `payroll_slips` table to see individual payments

---

## Part 8: Daily Usage

### Starting DARBCO Each Day

**Step 1: Start XAMPP MySQL**
- Open XAMPP Control Panel
- Click "Start" next to MySQL (if not running)

**Step 2: Start DARBCO**
- Open terminal in DARBCO folder
- Run: `npm run dev`

**Step 3: Open Browser**
- Go to: http://localhost:5173
- Login with your account

### Stopping DARBCO

**Stop DARBCO:**
- Press `Ctrl + C` in the terminal

**Stop XAMPP (Optional):**
- Click "Stop" next to MySQL in XAMPP Control Panel
- Or leave it running if you use it for other projects

---

## Part 9: Troubleshooting

### Problem: phpMyAdmin shows "Access Denied"

**Solution:** Check XAMPP MySQL is running
- Open XAMPP Control Panel
- MySQL should be green/running
- Click "Stop" then "Start" to restart

### Problem: "Cannot connect to database"

**Solution 1:** Verify XAMPP MySQL is running

**Solution 2:** Check `server/.env` settings
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=           ← Leave empty for XAMPP
```

**Solution 3:** Try changing `DB_HOST` to `localhost`:
```env
DB_HOST=localhost
```

### Problem: "Error importing database"

**Solution:** 
1. Make sure you selected the `darbco` database first (click it in sidebar)
2. Make sure you're importing `darbco.sql` from the `database/` folder
3. Try dropping the database and recreating it:
   - In phpMyAdmin, click `darbco`
   - Click "Operations" tab
   - Scroll down to "Remove database"
   - Click "Drop the database"
   - Create new database and try import again

### Problem: Port 3306 already in use

**Solution:** Another MySQL is running
- If you have standalone MySQL installed, stop it
- Windows: Services → MySQL → Stop
- Mac: System Preferences → MySQL → Stop
- Then start XAMPP MySQL

### Problem: Port 80 conflict (XAMPP Apache won't start)

**Solution:** Skype or other apps using port 80
- You don't need Apache for DARBCO, only MySQL!
- Just keep MySQL running
- Apache is optional

### Problem: "Tables don't appear in phpMyAdmin"

**Solution:**
1. Click the database name `darbco` in left sidebar
2. If still empty, re-import `darbco.sql`
3. Make sure the database is selected before importing

---

## Part 10: XAMPP Advantages

### Why XAMPP is Great for DARBCO

✅ **Visual Interface**
- See all tables and data in phpMyAdmin
- No command-line needed
- Easy to browse and search

✅ **Easy Backup**
- Just use Export in phpMyAdmin
- Download `.sql` file
- Keep multiple backups

✅ **Easy to Reset**
- Drop database
- Create new one
- Re-import `darbco.sql`

✅ **No Password Hassle**
- Default has no password
- Just leave `DB_PASS=` empty

✅ **One Control Panel**
- Start/stop MySQL with one click
- See if it's running at a glance

### Using XAMPP for Development

**View changes in real-time:**
1. Make changes in DARBCO (add beneficiary, production record, etc.)
2. Refresh phpMyAdmin
3. Click "Browse" on the table
4. See the new data immediately

**Test queries:**
1. In phpMyAdmin, click `darbco`
2. Click "SQL" tab
3. Write SQL queries to test
4. View results instantly

---

## Quick Reference Card

**XAMPP Locations:**
- Windows: `C:\xampp\`
- Mac: `/Applications/XAMPP/`

**URLs:**
- DARBCO Frontend: http://localhost:5173
- DARBCO Backend: http://localhost:3001
- phpMyAdmin: http://localhost/phpmyadmin

**Start DARBCO:**
```bash
# 1. Start XAMPP MySQL (in XAMPP Control Panel)
# 2. In DARBCO folder:
npm run dev
# 3. Open: http://localhost:5173
```

**Default Login:**
- Email: `admin@darbco.local`
- Password: `password`

**Database Connection (in server/.env):**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=              ← Leave empty!
```

**Backup Database:**
1. Open phpMyAdmin
2. Click `darbco`
3. Export → Quick → SQL → Export

**Restore Database:**
1. Open phpMyAdmin  
2. Click `darbco`
3. Import → Choose file → Import

---

## Next Steps

1. ✅ XAMPP MySQL running
2. ✅ Database imported via phpMyAdmin
3. ✅ DARBCO running with `npm run dev`
4. ✅ Logged in successfully

**Now you can:**
- Add beneficiaries
- Create production records
- Manage inventory
- Process payroll
- View everything in phpMyAdmin

---

**Congratulations!** 🎉

You're running DARBCO with XAMPP and phpMyAdmin!

Use phpMyAdmin to view and manage your database visually.
