import { Router, Request, Response } from 'express';
import pool from '../config/db.js';
import { InsertResult } from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [batches] = await pool.query(`
      SELECT pb.*, p.full_name AS prepared_by_name, v.full_name AS validated_by_name, a.full_name AS approved_by_name
      FROM payroll_batches pb
      JOIN users p ON p.id = pb.prepared_by
      LEFT JOIN users v ON v.id = pb.validated_by
      LEFT JOIN users a ON a.id = pb.approved_by
      ORDER BY pb.period_end DESC
    `);

    const batchesArray = batches as any[];

    if (batchesArray.length > 0) {
      const ids = batchesArray.map(b => b.id);
      const placeholders = ids.map(() => '?').join(',');

      const [slips] = await pool.execute(
        `SELECT ps.*, b.code AS beneficiary_code, b.full_name AS beneficiary_name
         FROM payroll_slips ps
         JOIN beneficiaries b ON b.id = ps.beneficiary_id
         WHERE ps.batch_id IN (${placeholders})`,
        ids
      );

      const slipsArray = slips as any[];

      for (const batch of batchesArray) {
        batch.slips = slipsArray.filter(s => s.batch_id === batch.id);
      }
    }

    res.json(batches);
  } catch (error) {
    console.error('Get payroll error:', error);
    res.status(500).json({ error: 'Failed to fetch payroll batches' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const { batch_no, period_start, period_end, prepared_by, slips = [] } = req.body;

    if (!batch_no || !period_start || !period_end || !prepared_by) {
      return res.status(400).json({ error: 'batch_no, period_start, period_end, and prepared_by are required' });
    }

    await connection.beginTransaction();

    const total = slips.reduce((sum: number, s: any) => sum + parseFloat(s.net_amount || 0), 0);

    const [batchResult] = await connection.execute(
      `INSERT INTO payroll_batches (batch_no, period_start, period_end, prepared_by, total_amount)
       VALUES (?, ?, ?, ?, ?)`,
      [batch_no, period_start, period_end, prepared_by, total]
    );

    const batchId = (batchResult as InsertResult).insertId;

    if (slips.length > 0) {
      for (const slip of slips) {
        const totalDeductions =
          parseFloat(slip.total_deductions ?? 0) ||
          (parseFloat(slip.credit_deduction ?? 0) +
            parseFloat(slip.material_deduction ?? 0) +
            parseFloat(slip.previous_balance ?? 0) +
            parseFloat(slip.labor_cost ?? 0) +
            parseFloat(slip.other_deductions ?? 0));

        await connection.execute(
          `INSERT INTO payroll_slips
           (slip_no, batch_id, beneficiary_id, production_record_id, payroll_period, harvest_date,
            class_a_boxes, class_b_boxes, special_boxes, class_a_price, class_b_price, special_price,
            material_deduction, previous_balance, labor_cost, other_deductions,
            gross_amount, credit_deduction, total_deductions, net_amount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            slip.slip_no || null,
            batchId,
            slip.beneficiary_id,
            slip.production_record_id || null,
            slip.payroll_period || null,
            slip.harvest_date || null,
            slip.class_a_boxes || 0,
            slip.class_b_boxes || 0,
            slip.special_boxes || 0,
            slip.class_a_price || 0,
            slip.class_b_price || 0,
            slip.special_price || 0,
            slip.material_deduction || 0,
            slip.previous_balance || 0,
            slip.labor_cost || 0,
            slip.other_deductions || 0,
            slip.gross_amount || 0,
            slip.credit_deduction || 0,
            totalDeductions,
            slip.net_amount || 0,
          ]
        );
      }
    }

    await connection.commit();
    res.json({ id: batchId, total_amount: total });
  } catch (error) {
    await connection.rollback();
    console.error('Create payroll error:', error);
    res.status(500).json({ error: 'Failed to save payroll batch' });
  } finally {
    connection.release();
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const { status, approved_by, validated_by, return_reason } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const params: any[] = [status];
    let sql = 'UPDATE payroll_batches SET status = ?';

    if (approved_by) {
      sql += ', approved_by = ?, approved_at = NOW()';
      params.push(approved_by);
    }
    if (validated_by) {
      sql += ', validated_by = ?, validated_at = NOW()';
      params.push(validated_by);
    }
    if (return_reason !== undefined) {
      sql += ', return_reason = ?';
      params.push(return_reason || null);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    await pool.execute(sql, params);
    res.json({ id });
  } catch (error) {
    console.error('Update payroll error:', error);
    res.status(500).json({ error: 'Failed to update payroll batch' });
  }
});

export default router;
