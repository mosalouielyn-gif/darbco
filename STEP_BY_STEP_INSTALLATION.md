# Step-by-Step Installation Guide

Complete guide to install and run DARBCO on your laptop from scratch.

---

## Part 1: Install Prerequisites

### Step 1.1: Install Node.js

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (Long Term Support)
   - Choose the version for your operating system:
     - Windows: Download `.msi` installer
     - Mac: Download `.pkg` installer
     - Linux: Use package manager or download binary

2. **Install Node.js**
   - Windows: Run the downloaded `.msi` file, click "Next" through the installer
   - Mac: Run the downloaded `.pkg` file, follow the installer
   - Linux: 
     ```bash
     # Ubuntu/Debian
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     
     # CentOS/RHEL
     curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
     sudo yum install -y nodejs
     ```

3. **Verify Installation**
   - Open Terminal (Mac/Linux) or Command Prompt (Windows)
   - Type these commands:
   ```bash
   node --version
   ```
   Should show: `v18.x.x` or higher
   
   ```bash
   npm --version
   ```
   Should show: `9.x.x` or higher

   If both commands work, you're ready to proceed!

### Step 1.2: Install MySQL

1. **Download MySQL**
   - Go to: https://dev.mysql.com/downloads/mysql/
   - Select your operating system
   - Download **MySQL Community Server 8.0+**

2. **Install MySQL**
   
   **Windows:**
   - Run the installer
   - Choose "Developer Default" setup type
   - Set a **root password** (remember this - you'll need it!)
   - Complete the installation
   - MySQL will start automatically

   **Mac:**
   - Run the `.dmg` installer
   - Set a **root password** during installation
   - Open System Preferences → MySQL
   - Click "Start MySQL Server"

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install mysql-server
   sudo systemctl start mysql
   sudo mysql_secure_installation
   ```
   Follow prompts to set root password

3. **Verify MySQL Installation**
   ```bash
   mysql --version
   ```
   Should show: `mysql Ver 8.0.x` or similar

4. **Test MySQL Connection**
   ```bash
   mysql -u root -p
   ```
   - Enter your root password when prompted
   - You should see: `mysql>`
   - Type `exit` to leave MySQL

---

## Part 2: Get the DARBCO Project

### Step 2.1: Download the Project

**If you have the files:**
- Extract the ZIP file to a folder on your laptop
- Example locations:
  - Windows: `C:\Users\YourName\Documents\darbco`
  - Mac: `/Users/YourName/Documents/darbco`
  - Linux: `/home/yourname/darbco`

**If using Git:**
```bash
cd ~/Documents
git clone <repository-url> darbco
cd darbco
```

### Step 2.2: Open Terminal in Project Folder

**Windows:**
1. Open File Explorer
2. Navigate to the DARBCO folder
3. In the address bar, type `cmd` and press Enter
4. Command Prompt opens in that folder

**Mac:**
1. Open Finder
2. Navigate to the DARBCO folder
3. Right-click the folder → Services → New Terminal at Folder

**Linux:**
1. Open File Manager
2. Navigate to the DARBCO folder
3. Right-click → Open in Terminal

### Step 2.3: Verify You're in the Right Folder

```bash
# Windows
dir

# Mac/Linux
ls
```

You should see files like:
- `package.json`
- `README.md`
- `server/` folder
- `database/` folder
- `src/` folder

---

## Part 3: Install Dependencies

### Step 3.1: Install All Dependencies

In your terminal (still in the DARBCO folder), run:

```bash
npm run install:all
```

**What this does:**
- Installs frontend dependencies (React, Tailwind, etc.)
- Installs backend dependencies (Express, MySQL driver, etc.)
- May take 2-5 minutes depending on your internet speed

**Expected output:**
```
added 500+ packages
```

**If you see errors:**
- Make sure you have internet connection
- Try: `npm cache clean --force` then run the command again

### Step 3.2: Verify Installation

Check that these folders exist:
```bash
# Windows
dir node_modules
dir server\node_modules

# Mac/Linux
ls node_modules
ls server/node_modules
```

Both should show many folders (packages installed).

---

## Part 4: Set Up the Database

### Step 4.1: Start MySQL (if not running)

**Windows:**
- Search for "Services" in Start Menu
- Find "MySQL80" or "MySQL"
- Right-click → Start

**Mac:**
- System Preferences → MySQL
- Click "Start MySQL Server"

**Linux:**
```bash
sudo systemctl start mysql
# or
sudo service mysql start
```

### Step 4.2: Create the Database

Open a **new terminal window** (keep the project terminal open) and run:

```bash
mysql -u root -p -e "CREATE DATABASE darbco;"
```

- Enter your MySQL root password when prompted
- You should see: Query OK

**Verify database was created:**
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

You should see `darbco` in the list.

### Step 4.3: Import the Database Schema

Still in the terminal, navigate to your DARBCO project folder and run:

```bash
# Windows
mysql -u root -p darbco < database\darbco.sql

# Mac/Linux
mysql -u root -p darbco < database/darbco.sql
```

- Enter your MySQL root password
- This will take 10-30 seconds
- No output means success!

### Step 4.4: Verify Database Tables

Check that tables were created:

```bash
mysql -u root -p darbco -e "SHOW TABLES;"
```

You should see 14 tables:
```
+------------------------+
| Tables_in_darbco       |
+------------------------+
| arb_log_carreros       |
| arb_logs               |
| audit_logs             |
| beneficiaries          |
| credit_balances        |
| daily_boxes            |
| finance_transactions   |
| inventory_categories   |
| inventory_items        |
| payroll_batches        |
| payroll_slips          |
| production_records     |
| restock_requests       |
| roles                  |
| stock_transactions     |
| users                  |
+------------------------+
```

### Step 4.5: Verify Test Data

Check that users were created:

```bash
mysql -u root -p darbco -e "SELECT email, full_name FROM users;"
```

You should see 5 users:
```
+---------------------------+---------------------------+
| email                     | full_name                 |
+---------------------------+---------------------------+
| admin@darbco.local        | DARBCO Administrator      |
| production@darbco.local   | Production Clerk          |
| inventory@darbco.local    | Inventory Bookkeeper      |
| payroll@darbco.local      | Payroll Personnel         |
| finance@darbco.local      | Finance Officer           |
+---------------------------+---------------------------+
```

---

## Part 5: Configure the Backend

### Step 5.1: Create Environment File

Go back to your project terminal and run:

**Windows:**
```bash
copy server\.env.example server\.env
```

**Mac/Linux:**
```bash
cp server/.env.example server/.env
```

### Step 5.2: Edit the Environment File

Open `server/.env` in a text editor:

**Windows:**
```bash
notepad server\.env
```

**Mac:**
```bash
open -e server/.env
```

**Linux:**
```bash
nano server/.env
# or
gedit server/.env
```

### Step 5.3: Update Database Password

In the `.env` file, you'll see:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=
PORT=3001
NODE_ENV=development
```

**Change `DB_PASS=` to your MySQL root password:**

```env
DB_PASS=your_mysql_password_here
```

For example, if your password is `mypassword123`:
```env
DB_PASS=mypassword123
```

**Important:** 
- No spaces around the `=`
- No quotes needed
- Save the file!

### Step 5.4: Verify Frontend Environment (Optional)

Check if `.env` exists in the root folder:

**Windows:**
```bash
type .env
```

**Mac/Linux:**
```bash
cat .env
```

Should show:
```env
VITE_API_URL=http://localhost:3001/api
```

If the file doesn't exist, create it:

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

---

## Part 6: Run the Application

### Step 6.1: Start Both Servers

In your project terminal, run:

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

**What's running:**
- **Frontend (React)**: http://localhost:5173
- **Backend (API)**: http://localhost:3001

### Step 6.2: Open the Application

1. Open your web browser (Chrome, Firefox, Edge, Safari)
2. Go to: **http://localhost:5173**
3. You should see the DARBCO login page

### Step 6.3: Log In

Use one of these test accounts:

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

### Step 6.4: Verify Everything Works

After logging in:
1. You should see a dashboard
2. Different users see different dashboards based on their role
3. No error messages in the browser

---

## Part 7: Using the Database

### 7.1: Understanding the System

The DARBCO system has **5 user roles**, each with different capabilities:

| Role | Access |
|------|--------|
| **Manager/Admin** | Full system access, user management, approvals |
| **Production Clerk** | Harvest records, daily boxes, ARB logs |
| **Inventory Bookkeeper** | Stock management, transactions, credits |
| **Payroll Personnel** | Beneficiary payroll processing |
| **Finance Officer** | Payroll validation, finance transactions |

### 7.2: Key Database Tables

**Users & Access:**
- `users` - System users (5 test accounts included)
- `roles` - User roles (5 roles: admin, production, inventory, payroll, finance)
- `audit_logs` - Track all system actions

**Production:**
- `beneficiaries` - Cooperative members (8 test beneficiaries included)
- `production_records` - Harvest data per beneficiary
- `daily_boxes` - Daily box counts per group
- `arb_logs` - ARB logs with carrero data

**Inventory:**
- `inventory_categories` - Material categories (7 included: Chemicals, Fertilizers, etc.)
- `inventory_items` - Stock items with Material ID, quantity, expiry
- `stock_transactions` - In/out movements
- `restock_requests` - Restock request workflow

**Payroll & Finance:**
- `payroll_batches` - Payroll periods
- `payroll_slips` - Individual beneficiary payments
- `credit_balances` - Beneficiary credit transactions
- `finance_transactions` - Financial records

### 7.3: Sample Beneficiaries (Already in Database)

The database includes 8 test beneficiaries:

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

### 7.4: Exploring Data via MySQL

You can view database content directly:

```bash
# Connect to MySQL
mysql -u root -p darbco

# View all beneficiaries
SELECT * FROM beneficiaries;

# View all users
SELECT email, full_name, role_id FROM users;

# View inventory categories
SELECT * FROM inventory_categories;

# Exit MySQL
exit
```

### 7.5: Common Workflows

**Add Production Record (as Production Clerk):**
1. Log in as `production@darbco.local`
2. Click "Harvest Records" tab
3. Click "Add Record"
4. Fill in the form (date, beneficiary, boxes)
5. Submit
6. Data is saved to `production_records` table

**Manage Inventory (as Inventory Bookkeeper):**
1. Log in as `inventory@darbco.local`
2. View stock levels in "Inventory" tab
3. Add new items via "Add Item" button
4. Record stock in/out via "Stock Transactions"
5. Data saved to `inventory_items` and `stock_transactions`

**Process Payroll (as Payroll Personnel):**
1. Log in as `payroll@darbco.local`
2. Click "Payroll" tab
3. Create new batch
4. System calculates based on production records
5. Submit for approval
6. Data saved to `payroll_batches` and `payroll_slips`

**Approve Payroll (as Finance Officer):**
1. Log in as `finance@darbco.local`
2. View pending payroll batches
3. Review and approve/reject
4. Updates status in `payroll_batches`

**User Management (as Manager/Admin):**
1. Log in as `admin@darbco.local`
2. Access "User Management"
3. Add/edit/deactivate users
4. Updates `users` table

---

## Part 8: Stopping and Restarting

### Stop the Application

In the terminal where `npm run dev` is running:
- Press `Ctrl + C` (Windows/Linux)
- Press `Cmd + C` (Mac)

Both servers will stop.

### Restart the Application

**Every time you want to use DARBCO:**

1. **Make sure MySQL is running**
   - Windows: Check Services
   - Mac: System Preferences → MySQL
   - Linux: `sudo systemctl status mysql`

2. **Open terminal in DARBCO folder**

3. **Run:**
   ```bash
   npm run dev
   ```

4. **Open browser to:** http://localhost:5173

---

## Part 9: Troubleshooting

### Problem: "npm: command not found"

**Solution:** Node.js is not installed or not in PATH
```bash
# Verify Node.js installation
node --version

# If this fails, reinstall Node.js from nodejs.org
```

### Problem: "Cannot connect to MySQL"

**Solution 1:** MySQL is not running
- Start MySQL service (see Part 4.1)

**Solution 2:** Wrong password in `server/.env`
- Check password in `server/.env`
- Try connecting manually: `mysql -u root -p`

**Solution 3:** Database doesn't exist
```bash
mysql -u root -p -e "CREATE DATABASE darbco;"
```

### Problem: "Port 3001 already in use"

**Solution:** Change the port in `server/.env`:
```env
PORT=3002
```

Then update `.env` in root folder:
```env
VITE_API_URL=http://localhost:3002/api
```

### Problem: "Port 5173 already in use"

**Solution:** Kill the process using that port

**Windows:**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -ti:5173 | xargs kill -9
```

### Problem: Login fails with "Invalid credentials"

**Solution 1:** Make sure backend is running
- Check terminal shows: `✓ DARBCO Server running`

**Solution 2:** Check database users exist
```bash
mysql -u root -p darbco -e "SELECT email FROM users;"
```

**Solution 3:** Re-import database
```bash
mysql -u root -p darbco < database/darbco.sql
```

### Problem: White screen after login

**Solution:** Check browser console (F12)
- Look for errors
- Make sure API URL is correct in `.env`
- Verify backend is running

### Problem: "Database connection failed"

**Solution:** Check `server/.env` settings
```env
DB_HOST=127.0.0.1    # Try 'localhost' if this doesn't work
DB_PORT=3306         # Default MySQL port
DB_NAME=darbco       # Must match database name
DB_USER=root         # Your MySQL user
DB_PASS=your_password_here
```

---

## Part 10: Next Steps

### Learn the System

1. **Log in with each role** to see different dashboards
2. **Add test data**:
   - Production records
   - Inventory items
   - Stock transactions
   - Payroll batches

3. **Explore features**:
   - View audit logs (as admin)
   - Generate reports
   - Process credits
   - Manage beneficiaries

### Backup Your Database

Save your data regularly:

```bash
# Backup database
mysqldump -u root -p darbco > backup.sql

# Restore from backup
mysql -u root -p darbco < backup.sql
```

### Customize

- Add real beneficiaries
- Add actual inventory items
- Update user accounts
- Configure for your needs

### Production Deployment

When ready to deploy to a server:
1. Read [README.md](README.md) "Building for Production"
2. Configure production database
3. Set `NODE_ENV=production`
4. Use proper passwords
5. Enable HTTPS

---

## Quick Reference Card

Save this for daily use:

```bash
# Start the application
cd /path/to/darbco
npm run dev

# Stop the application
Ctrl + C (or Cmd + C on Mac)

# Check if MySQL is running
mysql -u root -p

# Backup database
mysqldump -u root -p darbco > backup_$(date +%Y%m%d).sql

# View logs
# Just check the terminal where npm run dev is running
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

**Default Login:**
- Email: `admin@darbco.local`
- Password: `password`

---

## Getting Help

If you encounter issues:

1. Check the terminal output for error messages
2. Check browser console (F12) for errors
3. Review [QUICKSTART.md](QUICKSTART.md) troubleshooting section
4. Check [NPM_SETUP.md](NPM_SETUP.md) for npm-specific issues
5. Verify MySQL is running
6. Verify all steps were completed

---

**Congratulations!** 🎉

You now have DARBCO running on your laptop with a fully populated database!
