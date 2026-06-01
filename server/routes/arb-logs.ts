import { Router, Request, Response } from 'express';
import pool from '../config/db.js';
import { InsertResult } from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [logs] = await pool.query(`
      SELECT a.id, a.packing_date, a.block_no, a.recorded_at,
             b.code AS beneficiary_code, b.full_name AS beneficiary_name,
             u.full_name AS recorded_by_name
      FROM arb_logs a
      JOIN beneficiaries b ON b.id = a.beneficiary_id
      JOIN users u ON u.id = a.recorded_by
      ORDER BY a.packing_date DESC, a.id DESC
    `);

    const logsArray = logs as any[];

    if (logsArray.length > 0) {
      const ids = logsArray.map(l => l.id);
      const placeholders = ids.map(() => '?').join(',');

      const [carreros] = await pool.execute(
        `SELECT * FROM arb_log_carreros WHERE arb_log_id IN (${placeholders})`,
        ids
      );

      const carrerosArray = carreros as any[];

      for (const log of logsArray) {
        log.carreros = carrerosArray.filter(c => c.arb_log_id === log.id);
      }
    }

    res.json(logs);
  } catch (error) {
    console.error('Get ARB logs error:', error);
    res.status(500).json({ error: 'Failed to fetch ARB logs' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const { packing_date, beneficiary_id, block_no, recorded_by, carreros = [] } = req.body;

    if (!packing_date || !beneficiary_id || !recorded_by) {
      return res.status(400).json({ error: 'packing_date, beneficiary_id, and recorded_by are required' });
    }

    if (!Array.isArray(carreros) || carreros.length === 0) {
      return res.status(400).json({ error: 'At least one carrero is required' });
    }

    await connection.beginTransaction();

    const [logResult] = await connection.execute(
      `INSERT INTO arb_logs (packing_date, beneficiary_id, block_no, recorded_by)
       VALUES (?, ?, ?, ?)`,
      [packing_date, beneficiary_id, block_no || null, recorded_by]
    );

    const logId = (logResult as InsertResult).insertId;

    for (const carrero of carreros) {
      await connection.execute(
        `INSERT INTO arb_log_carreros (arb_log_id, carrero_name, time_arrival, w11, w12, w13, w14)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          logId,
          carrero.carrero_name || '',
          carrero.time_arrival || null,
          carrero.w11 || 0,
          carrero.w12 || 0,
          carrero.w13 || 0,
          carrero.w14 || 0
        ]
      );
    }

    await connection.commit();
    res.json({ id: logId });
  } catch (error) {
    await connection.rollback();
    console.error('Create ARB log error:', error);
    res.status(500).json({ error: 'Failed to save ARB log' });
  } finally {
    connection.release();
  }
});

export default router;
