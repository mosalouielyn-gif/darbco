# DARBCO Agricultural Management System

> **🚀 First time here?** 
> - **Using XAMPP**: Read **[XAMPP_INSTALLATION.md](XAMPP_INSTALLATION.md)** ⭐ EASIEST
> - **Using MySQL**: Read **[STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md)** for detailed instructions
> - **Experienced**: Read **[START_HERE.md](START_HERE.md)** for quick setup

A comprehensive agricultural management system for banana cooperatives with production tracking, inventory management, payroll processing, and financial workflows.

## Features

- **Production Tracking**: Harvest records, daily boxes per group, ARB logs
- **Inventory Management**: Category-based material IDs, expiry tracking, stock transactions
- **Payroll Processing**: Beneficiary payroll based on production data
- **Finance Management**: Transaction tracking and financial workflows
- **User Management**: Role-based access control (5 distinct roles)
- **Audit Trail**: Comprehensive logging of all system activities

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL
- **Build Tool**: Vite

## Prerequisites

- **Node.js 18+** with npm (included with Node.js)
- **Database** (choose one):
  - **XAMPP** (recommended - includes MySQL + phpMyAdmin) - [Download](https://www.apachefriends.org/)
  - **MySQL 8.0+** (standalone) - [Download](https://dev.mysql.com/downloads/mysql/)

> **Note**: This project uses npm as the package manager. XAMPP is recommended for beginners as it includes a visual interface (phpMyAdmin).

## Installation

### 1. Install Dependencies

```bash
# Install all dependencies (root + server)
npm run install:all
```

> This will run `npm install` in both the root directory and the `server/` directory.

### 2. Database Setup

**Using XAMPP:**
1. Start XAMPP, run MySQL
2. Open http://localhost/phpmyadmin
3. Create database: `darbco`
4. Import `database/darbco.sql` via Import tab

**Using standalone MySQL:**
```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE darbco;"

# Import the schema
mysql -u root -p darbco < database/darbco.sql
```

### 3. Configure Environment

Create `server/.env` from the example:
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

**For XAMPP users:**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=              # Leave empty for XAMPP
PORT=3001
NODE_ENV=development
```

**For standalone MySQL:**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=your_password_here
PORT=3001
NODE_ENV=development
```

### 4. Frontend API Configuration

The frontend is configured to connect to `http://localhost:3001/api` by default. If you need to change this, update the API base URL in your frontend configuration.

## Running the Application

### Development Mode (Recommended)

Run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Frontend dev server on `http://localhost:5173`
- Backend API server on `http://localhost:3001`

### Run Separately

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

## Default Users

After importing the database, you can log in with:

- **Manager/Admin**: `admin@darbco.local` / `password`
- **Production Clerk**: `production@darbco.local` / `password`
- **Inventory Bookkeeper**: `inventory@darbco.local` / `password`
- **Payroll Personnel**: `payroll@darbco.local` / `password`
- **Finance Officer**: `finance@darbco.local` / `password`

## User Roles

1. **Production Clerk**: Manages harvest records, daily boxes, and ARB logs
2. **Inventory Bookkeeper**: Handles stock management and transactions
3. **Payroll Personnel**: Processes beneficiary payroll
4. **Finance Officer**: Validates payroll and manages financial transactions
5. **Manager/Admin**: Final approvals, reports, user account maintenance, role access monitoring, and audit review

## API Endpoints

All API endpoints are prefixed with `/api`:

- **Authentication**: `/api/auth/login`
- **Inventory**: `/api/inventory`
- **Production**: `/api/production`
- **Payroll**: `/api/payroll`
- **Beneficiaries**: `/api/beneficiaries`
- **Users**: `/api/users`
- **Daily Boxes**: `/api/daily-boxes`
- **ARB Logs**: `/api/arb-logs`
- **Credits**: `/api/credits`
- **Restock**: `/api/restock`
- **Stock Transactions**: `/api/stock-transactions`
- **Finance**: `/api/finance`
- **Audit Logs**: `/api/audit-logs`

## Project Structure

```
.
├── src/                    # Frontend React application
│   ├── app/               # Main app components
│   └── styles/            # CSS styles
├── server/                # Backend Node.js/Express server
│   ├── config/           # Database configuration
│   ├── routes/           # API route handlers
│   ├── middleware/       # Express middleware
│   └── utils/            # Helper functions
├── database/             # SQL schema and migrations
└── backend/              # Legacy PHP backend (deprecated)
```

## Building for Production

```bash
# Build frontend
npm run build

# Build backend TypeScript to JavaScript
npm run build:server

# Run backend in production mode
cd server && npm run prod
```

## Package Manager

This project uses **npm** (Node Package Manager). Do not use yarn or pnpm as they may cause dependency conflicts.

To verify npm is installed:
```bash
npm --version
```

If you need to clean and reinstall all dependencies:
```bash
npm run clean
npm run install:all
```

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `server/.env`
- Ensure database exists: `SHOW DATABASES;`

### Port Already in Use

If port 3001 is already in use, change it in `server/.env`:

```env
PORT=3002
```

### Frontend Can't Connect to Backend

- Ensure backend is running on `http://localhost:3001`
- Check browser console for CORS errors
- Verify API base URL configuration in frontend

## Additional Documentation

📚 **[DOCS_INDEX.md](DOCS_INDEX.md)** - Complete documentation index with all guides

Installation guides (pick one):
- **[XAMPP_INSTALLATION.md](XAMPP_INSTALLATION.md)** - ⭐ Using XAMPP + phpMyAdmin (EASIEST)
- **[STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md)** - 🌟 Using standalone MySQL (Detailed)
- **[QUICKSTART.md](QUICKSTART.md)** - Fast 5-step setup (for experienced users)
- **[INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)** - Checklist format
- **[START_HERE.md](START_HERE.md)** - Quick start overview

Technical documentation:
- **[NPM_SETUP.md](NPM_SETUP.md)** - Detailed npm guide and troubleshooting
- **[NPM_CONVERSION.md](NPM_CONVERSION.md)** - npm configuration details
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - PHP to Node.js migration notes

## License

Proprietary - DARBCO Agricultural Cooperative
