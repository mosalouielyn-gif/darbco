import { Router, Request, Response } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, i.material_id, i.item_name, i.unit,
             ru.full_name AS requested_by_name,
             rv.full_name AS reviewed_by_name
      FROM restock_requests r
      JOIN inventory_items i ON i.id = r.item_id
      JOIN users ru ON ru.id = r.requested_by
      LEFT JOIN users rv ON rv.id = r.reviewed_by
      ORDER BY r.requested_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get restock requests error:', error);
    res.status(500).json({ error: 'Failed to fetch restock requests' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { request_no, item_id, quantity, requested_by, notes } = req.body;

    if (!request_no || !item_id || quantity === undefined || !requested_by) {
      return res.status(400).json({ error: 'request_no, item_id, quantity, and requested_by are required' });
    }

    const [result] = await pool.execute(
      `INSERT INTO restock_requests (request_no, item_id, quantity, requested_by, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [request_no, item_id, quantity, requested_by, notes || null]
    );

    const insertResult = result as any;
    res.json({ id: insertResult.insertId });
  } catch (error) {
    console.error('Create restock request error:', error);
    res.status(500).json({ error: 'Failed to create restock request' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const { status, reviewed_by } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    await pool.execute(
      `UPDATE restock_requests
       SET status = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE id = ?`,
      [status, reviewed_by || null, id]
    );

    res.json({ id });
  } catch (error) {
    console.error('Update restock request error:', error);
    res.status(500).json({ error: 'Failed to update restock request' });
  }
});

export default router;
