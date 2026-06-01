import { Router, Request, Response } from 'express';
import pool from '../config/db.js';
import { audit } from '../utils/helpers.js';
import { InsertResult } from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const where: string[] = [];
    const params: any[] = [];

    if (req.query.from) {
      where.push('t.txn_at >= ?');
      params.push(`${req.query.from} 00:00:00`);
    }
    if (req.query.to) {
      where.push('t.txn_at <= ?');
      params.push(`${req.query.to} 23:59:59`);
    }
    if (req.query.type) {
      where.push('t.txn_type = ?');
      params.push(req.query.type);
    }
    if (req.query.item_id) {
      where.push('t.item_id = ?');
      params.push(parseInt(req.query.item_id as string));
    }

    let sql = `
      SELECT t.id, t.reference_no, t.txn_type, t.quantity, t.unit_cost,
             t.supplier_name, t.reason, t.txn_at,
             i.item_name, i.material_id, i.unit,
             b.code AS beneficiary_code, b.full_name AS beneficiary_name,
             u.full_name AS recorded_by_name
      FROM stock_transactions t
      JOIN inventory_items i ON i.id = t.item_id
      LEFT JOIN beneficiaries b ON b.id = t.beneficiary_id
      JOIN users u ON u.id = t.recorded_by
    `;

    if (where.length > 0) {
      sql += ' WHERE ' + where.join(' AND ');
    }
    sql += ' ORDER BY t.txn_at DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Get stock transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch stock transactions' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const {
      reference_no,
      txn_type,
      item_id,
      quantity,
      unit_cost = 0,
      supplier_name,
      beneficiary_id,
      reason,
      recorded_by
    } = req.body;

    if (!reference_no || !txn_type || !item_id || quantity === undefined || !recorded_by) {
      return res.status(400).json({ error: 'reference_no, txn_type, item_id, quantity, and recorded_by are required' });
    }

    await connection.beginTransaction();

    const [txnResult] = await connection.execute(
      `INSERT INTO stock_transactions
       (reference_no, txn_type, item_id, quantity, unit_cost, supplier_name, beneficiary_id, reason, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reference_no,
        txn_type,
        item_id,
        quantity,
        unit_cost,
        supplier_name || null,
        beneficiary_id || null,
        reason || null,
        recorded_by
      ]
    );

    const txnId = (txnResult as InsertResult).insertId;

    // Update inventory on_hand by signed quantity
    await connection.execute(
      'UPDATE inventory_items SET on_hand = on_hand + ? WHERE id = ?',
      [quantity, item_id]
    );

    await connection.commit();
    await audit(recorded_by, 'Inventory', txn_type.toUpperCase(), 'stock_transactions', String(txnId), null, null);
    res.json({ id: txnId });
  } catch (error) {
    await connection.rollback();
    console.error('Create stock transaction error:', error);
    res.status(500).json({ error: 'Failed to record transaction' });
  } finally {
    connection.release();
  }
});

export default router;
