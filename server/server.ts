import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRouter from './routes/auth.js';
import inventoryRouter from './routes/inventory.js';
import productionRouter from './routes/production.js';
import payrollRouter from './routes/payroll.js';
import beneficiariesRouter from './routes/beneficiaries.js';
import usersRouter from './routes/users.js';
import dailyBoxesRouter from './routes/daily-boxes.js';
import arbLogsRouter from './routes/arb-logs.js';
import creditsRouter from './routes/credits.js';
import restockRouter from './routes/restock.js';
import stockTransactionsRouter from './routes/stock-transactions.js';
import financeRouter from './routes/finance.js';
import auditLogsRouter from './routes/audit-logs.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DARBCO API Server Running', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/production', productionRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/beneficiaries', beneficiariesRouter);
app.use('/api/users', usersRouter);
app.use('/api/daily-boxes', dailyBoxesRouter);
app.use('/api/arb-logs', arbLogsRouter);
app.use('/api/credits', creditsRouter);
app.use('/api/restock', restockRouter);
app.use('/api/stock-transactions', stockTransactionsRouter);
app.use('/api/finance', financeRouter);
app.use('/api/audit-logs', auditLogsRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
  console.log(`✓ DARBCO Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Database: ${process.env.DB_NAME || 'darbco'}`);
  });
}
