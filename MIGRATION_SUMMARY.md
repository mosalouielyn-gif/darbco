# PHP to Node.js Migration Summary

## What Was Changed

The DARBCO system has been successfully migrated from a PHP backend (designed for XAMPP) to a modern **Node.js/Express + TypeScript** stack.

## New Architecture

### Before (PHP/XAMPP)
- **Backend**: PHP files in `backend/` folder
- **Database**: MySQL via PDO
- **Server**: Apache (XAMPP)
- **Deployment**: Copy to `htdocs/darbco-api/`

### After (Node.js)
- **Backend**: TypeScript/Express in `server/` folder
- **Database**: MySQL via `mysql2` library
- **Server**: Node.js built-in HTTP server
- **Deployment**: Run with `npm run dev`

## File Structure

```
DARBCO/
├── src/                        # React frontend (unchanged)
│   ├── app/
│   │   ├── components/
│   │   ├── utils/
│   │   │   └── api.ts         # ✅ NEW: API client for backend calls
│   │   └── App.tsx
│   └── styles/
│
├── server/                     # ✅ NEW: Node.js backend
│   ├── config/
│   │   └── db.ts              # MySQL connection pool
│   ├── routes/
│   │   ├── auth.ts            # Login endpoint
│   │   ├── inventory.ts       # Inventory CRUD
│   │   ├── production.ts      # Production records
│   │   ├── payroll.ts         # Payroll batches
│   │   ├── beneficiaries.ts   # Beneficiary management
│   │   ├── users.ts           # User management
│   │   ├── daily-boxes.ts     # Daily box records
│   │   ├── arb-logs.ts        # ARB logs
│   │   ├── credits.ts         # Credit balances
│   │   ├── restock.ts         # Restock requests
│   │   ├── stock-transactions.ts # Stock transactions
│   │   ├── finance.ts         # Finance transactions
│   │   └── audit-logs.ts      # Audit logs
│   ├── middleware/
│   │   └── errorHandler.ts    # Error handling
│   ├── utils/
│   │   └── helpers.ts         # Audit logging helper
│   ├── .env                   # Environment configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── server.ts              # Main Express app
│
├── database/
│   └── darbco.sql             # MySQL schema (unchanged)
│
├── backend/                    # ⚠️ DEPRECATED: Old PHP files
│
├── .env                        # Frontend environment
├── package.json                # Root package with dev scripts
├── README.md                   # Full documentation
├── QUICKSTART.md               # Quick setup guide
└── MIGRATION_SUMMARY.md        # This file
```

## API Endpoints (All Migrated)

All PHP endpoints have been converted to Express routes:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/inventory` | GET/POST/PUT/DELETE | Inventory items |
| `/api/production` | GET/POST | Production records |
| `/api/payroll` | GET/POST/PUT | Payroll batches |
| `/api/beneficiaries` | GET/POST/PUT/DELETE | Beneficiary management |
| `/api/users` | GET/POST/PUT/DELETE | User accounts |
| `/api/daily-boxes` | GET/POST | Daily box records |
| `/api/arb-logs` | GET/POST | ARB logs with carreros |
| `/api/credits` | GET/POST/PUT | Credit balances |
| `/api/restock` | GET/POST/PUT | Restock requests |
| `/api/stock-transactions` | GET/POST | Stock movements |
| `/api/finance` | GET/POST | Finance transactions |
| `/api/audit-logs` | GET | System audit trail |

## Key Features Preserved

✅ All CRUD operations  
✅ Transaction support (payroll, ARB logs, stock transactions)  
✅ Audit logging  
✅ Password hashing with bcrypt  
✅ CORS support  
✅ Error handling  
✅ Auto-generated Material IDs  
✅ Soft deletes for items with dependencies  

## New Features Added

✅ TypeScript for type safety  
✅ Modern async/await syntax  
✅ Connection pooling  
✅ Environment-based configuration  
✅ Hot reload in development (via `tsx watch`)  
✅ Centralized API client for frontend  
✅ Real authentication (replaced mock accounts)  

## Running the System

> **Package Manager**: This project uses **npm**. Make sure you have Node.js 18+ installed (which includes npm).

### Quick Start
```bash
# Verify npm is installed
npm --version

# Install everything
npm run install:all

# Set up database
mysql -u root -p -e "CREATE DATABASE darbco;"
mysql -u root -p darbco < database/darbco.sql

# Configure server/.env with your MySQL password

# Run both frontend and backend
npm run dev
```

### Individual Commands
```bash
# Frontend only (port 5173)
npm run dev:client

# Backend only (port 3001)
npm run dev:server
```

## Configuration Files

### `server/.env` (Backend)
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=your_password
PORT=3001
NODE_ENV=development
```

### `.env` (Frontend)
```env
VITE_API_URL=http://localhost:3001/api
```

## Breaking Changes

1. **Login endpoint** now returns a different structure:
   - Before: Mock accounts from `types.ts`
   - After: Real API call to `/api/auth/login`

2. **API base URL** is now configurable via environment variable

3. **User object** structure matches database schema:
   ```typescript
   {
     id: string,           // from database
     name: string,         // full_name from database
     email: string,
     role: string          // role code from database
   }
   ```

## Database Notes

- The MySQL schema (`database/darbco.sql`) remains **unchanged**
- All table structures are identical
- Sample data and test accounts are included
- Password hashing algorithm changed from PHP's `password_hash()` to bcrypt (compatible)

## Testing

Default test accounts (from database):

| Email | Password | Role |
|-------|----------|------|
| admin@darbco.local | password | Manager/Admin |
| production@darbco.local | password | Production Clerk |
| inventory@darbco.local | password | Inventory Bookkeeper |
| payroll@darbco.local | password | Payroll Personnel |
| finance@darbco.local | password | Finance Officer |

## Deployment Differences

### PHP/XAMPP Deployment (Old)
1. Copy `backend/` to `htdocs/darbco-api/`
2. Import SQL to phpMyAdmin
3. Start Apache
4. Access via `localhost/darbco-api/`

### Node.js Deployment (New)
1. Clone repository
2. Run `npm run install:all`
3. Import SQL to MySQL
4. Configure `server/.env`
5. Run `npm run dev` or `npm start` in production

## Performance Improvements

- **Connection pooling**: Reuses database connections instead of creating new ones per request
- **Async operations**: Non-blocking I/O operations
- **TypeScript**: Catches errors at compile time
- **Modern syntax**: ES2022 features for cleaner code

## Security Enhancements

- Environment-based configuration (no hardcoded credentials)
- Prepared statements (prevents SQL injection)
- bcrypt password hashing (10 rounds)
- CORS configuration
- Error messages don't leak sensitive information

## What to Do with Old PHP Backend

The `backend/` folder is now **deprecated** but kept for reference. You can:

1. **Keep it** as a backup during transition
2. **Delete it** once you've verified everything works
3. **Archive it** to a separate folder

The new Node.js backend in `server/` is a complete replacement.

## Need Help?

- **Quick setup**: See [QUICKSTART.md](QUICKSTART.md)
- **Full docs**: See [README.md](README.md)
- **Troubleshooting**: Check the troubleshooting section in QUICKSTART.md

---

**Migration completed successfully!** 🎉

All PHP endpoints have been converted to TypeScript/Express with full feature parity.
