import { Router, Request, Response } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT cb.id, cb.receipt_no, cb.quantity, cb.unit_cost, cb.amount,
             cb.remaining_balance, cb.status, cb.payroll_batch, cb.issued_at,
             b.code AS beneficiary_code, b.full_name AS beneficiary_name,
             i.item_name, i.material_id, i.unit,
             u.full_name AS issued_by_name
      FROM credit_balances cb
      JOIN beneficiaries b ON b.id = cb.beneficiary_id
      JOIN inventory_items i ON i.id = cb.item_id
      JOIN users u ON u.id = cb.issued_by
      ORDER BY cb.issued_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ error: 'Failed to fetch credit balances' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { receipt_no, beneficiary_id, item_id, quantity, unit_cost, payroll_batch, issued_by } = req.body;

    if (!receipt_no || !beneficiary_id || !item_id || quantity === undefined || unit_cost === undefined || !issued_by) {
      return res.status(400).json({ error: 'receipt_no, beneficiary_id, item_id, quantity, unit_cost, and issued_by are required' });
    }

    const amount = parseFloat(quantity) * parseFloat(unit_cost);

    const [result] = await pool.execute(
      `INSERT INTO credit_balances
       (receipt_no, beneficiary_id, item_id, quantity, unit_cost, amount, remaining_balance, payroll_batch, issued_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [receipt_no, beneficiary_id, item_id, quantity, unit_cost, amount, amount, payroll_batch || null, issued_by]
    );

    const insertResult = result as any;
    res.json({ id: insertResult.insertId, amount });
  } catch (error) {
    console.error('Create credit error:', error);
    res.status(500).json({ error: 'Failed to create credit balance' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const { remaining_balance, status, payroll_batch } = req.body;
    const fields: string[] = [];
    const params: any[] = [];

    if (remaining_balance !== undefined) { fields.push('remaining_balance = ?'); params.push(remaining_balance); }
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }
    if (payroll_batch !== undefined) { fields.push('payroll_batch = ?'); params.push(payroll_batch); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    params.push(id);
    await pool.execute(`UPDATE credit_balances SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ id });
  } catch (error) {
    console.error('Update credit error:', error);
    res.status(500).json({ error: 'Failed to update credit balance' });
  }
});

export default router;
