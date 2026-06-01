import { Router, Request, Response } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, u.full_name AS recorded_by_name
      FROM finance_transactions f
      JOIN users u ON u.id = f.recorded_by
      ORDER BY f.txn_date DESC, f.id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get finance transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch finance transactions' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { reference_no, txn_date, category, description, amount, direction, recorded_by } = req.body;

    if (!reference_no || !txn_date || !category || !description || amount === undefined || !direction || !recorded_by) {
      return res.status(400).json({
        error: 'reference_no, txn_date, category, description, amount, direction, and recorded_by are required'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO finance_transactions (reference_no, txn_date, category, description, amount, direction, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [reference_no, txn_date, category, description, amount, direction, recorded_by]
    );

    const insertResult = result as any;
    res.json({ id: insertResult.insertId });
  } catch (error) {
    console.error('Create finance transaction error:', error);
    res.status(500).json({ error: 'Failed to create finance transaction' });
  }
});

export default router;
