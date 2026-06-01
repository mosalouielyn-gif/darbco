# DARBCO Backend Server

Node.js/Express/TypeScript backend API for DARBCO Agricultural Management System.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file from the example:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### 3. Edit Configuration

Edit `.env` with your settings:

**For XAMPP users (recommended):**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=              # Leave empty for XAMPP
PORT=3001
NODE_ENV=development
```

**For standalone MySQL users:**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=your_password_here
PORT=3001
NODE_ENV=development
```

## Running the Server

### Development Mode (with hot reload)

```bash
npm run dev
```

Server will start on http://localhost:3001

### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Run compiled code
npm run prod
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload (development) |
| `npm start` | Start with tsx (development) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run prod` | Run compiled production build |

## API Endpoints

All endpoints are prefixed with `/api`:

### Authentication
- `POST /api/auth/login` - User login

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create inventory item
- `PUT /api/inventory?id={id}` - Update inventory item
- `DELETE /api/inventory?id={id}` - Delete inventory item

### Production
- `GET /api/production` - Get production records
- `POST /api/production` - Create production record

### Payroll
- `GET /api/payroll` - Get payroll batches
- `POST /api/payroll` - Create payroll batch
- `PUT /api/payroll?id={id}` - Update payroll batch

### Beneficiaries
- `GET /api/beneficiaries` - Get all beneficiaries
- `POST /api/beneficiaries` - Create beneficiary
- `PUT /api/beneficiaries?id={id}` - Update beneficiary
- `DELETE /api/beneficiaries?id={id}` - Deactivate beneficiary

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users?id={id}` - Update user
- `DELETE /api/users?id={id}` - Deactivate user

### Daily Boxes
- `GET /api/daily-boxes` - Get daily box records
- `POST /api/daily-boxes` - Create daily box record

### ARB Logs
- `GET /api/arb-logs` - Get ARB logs
- `POST /api/arb-logs` - Create ARB log

### Credits
- `GET /api/credits` - Get credit balances
- `POST /api/credits` - Create credit balance
- `PUT /api/credits?id={id}` - Update credit balance

### Restock
- `GET /api/restock` - Get restock requests
- `POST /api/restock` - Create restock request
- `PUT /api/restock?id={id}` - Update restock request

### Stock Transactions
- `GET /api/stock-transactions` - Get stock transactions
- `POST /api/stock-transactions` - Create stock transaction

### Finance
- `GET /api/finance` - Get finance transactions
- `POST /api/finance` - Create finance transaction

### Audit Logs
- `GET /api/audit-logs` - Get audit logs

## Database Connection

The server connects to MySQL using the `mysql2` library with connection pooling.

Configuration is loaded from `.env` file.

## Project Structure

```
server/
├── config/
│   └── db.ts              # Database connection pool
├── routes/
│   ├── auth.ts            # Authentication endpoints
│   ├── inventory.ts       # Inventory CRUD
│   ├── production.ts      # Production records
│   ├── payroll.ts         # Payroll processing
│   ├── beneficiaries.ts   # Beneficiary management
│   ├── users.ts           # User management
│   ├── daily-boxes.ts     # Daily box records
│   ├── arb-logs.ts        # ARB logs
│   ├── credits.ts         # Credit balances
│   ├── restock.ts         # Restock requests
│   ├── stock-transactions.ts # Stock transactions
│   ├── finance.ts         # Finance transactions
│   └── audit-logs.ts      # Audit logs
├── middleware/
│   └── errorHandler.ts    # Error handling middleware
├── utils/
│   └── helpers.ts         # Helper functions (audit logging)
├── .env.example           # Environment variables template
├── .env                   # Your configuration (create this)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── server.ts              # Main Express application
```

## Error Handling

The server includes centralized error handling middleware that:
- Catches all errors
- Returns JSON error responses
- Logs errors to console

## CORS

CORS is enabled for all origins in development. For production, update the CORS configuration in `server.ts`.

## Database Requirements

Make sure you have:
1. MySQL 8.0+ running (or XAMPP MySQL)
2. Database `darbco` created
3. Schema imported from `../database/darbco.sql`

## Troubleshooting

### "Cannot connect to database"

**Check:**
1. MySQL is running
2. `.env` file exists and has correct values
3. Database `darbco` exists
4. Password is correct (or empty for XAMPP)

### "Port 3001 already in use"

**Solution:** Change `PORT` in `.env`:
```env
PORT=3002
```

Also update frontend `.env`:
```env
VITE_API_URL=http://localhost:3002/api
```

### "Module not found"

**Solution:** Install dependencies:
```bash
npm install
```

### TypeScript errors

**Solution:** Check `tsconfig.json` is present and run:
```bash
npm run build
```

## Development

The server uses:
- **Express** - Web framework
- **TypeScript** - Type safety
- **mysql2** - MySQL driver with promises
- **bcrypt** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **tsx** - TypeScript execution with hot reload

## Production Deployment

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Set environment variables:
   ```env
   NODE_ENV=production
   DB_PASS=secure_password
   ```

3. Run the compiled code:
   ```bash
   npm run prod
   ```

4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name darbco-api
   ```

## License

Proprietary - DARBCO Agricultural Cooperative
