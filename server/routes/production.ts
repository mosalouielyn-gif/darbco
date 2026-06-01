import { Router, Request, Response } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const where: string[] = [];
    const params: any[] = [];

    if (req.query.from) {
      where.push('pr.packing_date >= ?');
      params.push(req.query.from);
    }
    if (req.query.to) {
      where.push('pr.packing_date <= ?');
      params.push(req.query.to);
    }

    let sql = `
      SELECT pr.*, b.code AS beneficiary_code, b.full_name AS beneficiary_name,
             u.full_name AS recorded_by_name
      FROM production_records pr
      JOIN beneficiaries b ON b.id = pr.beneficiary_id
      JOIN users u ON u.id = pr.recorded_by
    `;
    if (where.length > 0) {
      sql += ' WHERE ' + where.join(' AND ');
    }
    sql += ' ORDER BY pr.packing_date DESC, pr.id DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Get production error:', error);
    res.status(500).json({ error: 'Failed to fetch production records' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      record_no,
      harvest_date,
      packing_date,
      beneficiary_id,
      harvester_name,
      sub_code,
      stems_cut = 0,
      buligs_total = 0,
      buligs_11w = 0,
      buligs_12w = 0,
      buligs_13w = 0,
      buligs_14w = 0,
      class_a_hands = 0,
      class_a_big_hands = 0,
      class_a_small_hands = 0,
      class_a_cps = 0,
      class_a_sh = 0,
      class_a_fp = 0,
      class_b_total = 0,
      class_b_big_hands = 0,
      class_b_small_hands = 0,
      class_b_cps = 0,
      class_b_clb = 0,
      class_b_h = 0,
      class_b_i = 0,
      class_b_d = 0,
      special_total = 0,
      defects_11w = 0,
      defects_12w = 0,
      defects_13w = 0,
      defects_14w = 0,
      rejects_11w = 0,
      rejects_12w = 0,
      rejects_13w = 0,
      rejects_14w = 0,
      status = 'Submitted',
      recorded_by
    } = req.body;

    if (!packing_date || !beneficiary_id || !recorded_by) {
      return res.status(400).json({ error: 'packing_date, beneficiary_id, and recorded_by are required' });
    }

    const [result] = await pool.execute(
      `INSERT INTO production_records
       (record_no, harvest_date, packing_date, beneficiary_id, harvester_name, sub_code, stems_cut,
        buligs_total, buligs_11w, buligs_12w, buligs_13w, buligs_14w,
        class_a_hands, class_a_big_hands, class_a_small_hands, class_a_cps, class_a_sh, class_a_fp,
        class_b_total, class_b_big_hands, class_b_small_hands, class_b_cps, class_b_clb, class_b_h, class_b_i, class_b_d,
        special_total, defects_11w, defects_12w, defects_13w, defects_14w,
        rejects_11w, rejects_12w, rejects_13w, rejects_14w, status, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [record_no || null, harvest_date || packing_date, packing_date, beneficiary_id, harvester_name || null, sub_code || null, stems_cut,
       buligs_total, buligs_11w, buligs_12w, buligs_13w, buligs_14w,
       class_a_hands, class_a_big_hands, class_a_small_hands, class_a_cps, class_a_sh, class_a_fp,
       class_b_total, class_b_big_hands, class_b_small_hands, class_b_cps, class_b_clb, class_b_h, class_b_i, class_b_d,
       special_total, defects_11w, defects_12w, defects_13w, defects_14w,
       rejects_11w, rejects_12w, rejects_13w, rejects_14w, status, recorded_by]
    );

    const insertResult = result as any;
    res.json({ id: insertResult.insertId });
  } catch (error) {
    console.error('Create production error:', error);
    res.status(500).json({ error: 'Failed to create production record' });
  }
});

export default router;
