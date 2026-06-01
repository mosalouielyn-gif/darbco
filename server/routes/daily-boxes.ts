import { Router, Request, Response } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT db.*, u.full_name AS recorded_by_name,
             (db.class_a_total + db.class_b_total + db.special_total) AS total
      FROM daily_boxes db
      JOIN users u ON u.id = db.recorded_by
      ORDER BY db.packing_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get daily boxes error:', error);
    res.status(500).json({ error: 'Failed to fetch daily boxes' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      packing_date,
      first_box_at,
      last_box_at,
      class_a_total = 0,
      class_b_total = 0,
      special_total = 0,
      recorded_by
    } = req.body;

    if (!packing_date || !recorded_by) {
      return res.status(400).json({ error: 'packing_date and recorded_by are required' });
    }

    const [result] = await pool.execute(
      `INSERT INTO daily_boxes
       (packing_date, first_box_at, last_box_at, class_a_total, class_b_total, special_total, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [packing_date, first_box_at || null, last_box_at || null, class_a_total, class_b_total, special_total, recorded_by]
    );

    const insertResult = result as any;
    res.json({ id: insertResult.insertId });
  } catch (error) {
    console.error('Create daily boxes error:', error);
    res.status(500).json({ error: 'Failed to create daily boxes record' });
  }
});

export default router;
