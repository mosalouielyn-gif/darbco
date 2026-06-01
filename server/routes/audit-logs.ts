import { Router, Request, Response } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.module, a.action, a.target_type, a.target_id, a.details, a.ip_address, a.created_at,
             u.full_name AS user_name, u.email
      FROM audit_logs a
      JOIN users u ON u.id = a.user_id
      ORDER BY a.created_at DESC
      LIMIT 500
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;
