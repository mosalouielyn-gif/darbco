import { Router, Request, Response } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, code, full_name, block_no, contact_no, address, is_active, created_at
      FROM beneficiaries ORDER BY code
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get beneficiaries error:', error);
    res.status(500).json({ error: 'Failed to fetch beneficiaries' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { code, full_name, block_no, contact_no, address } = req.body;

    if (!code || !full_name) {
      return res.status(400).json({ error: 'code and full_name are required' });
    }

    try {
      const [result] = await pool.execute(
        `INSERT INTO beneficiaries (code, full_name, block_no, contact_no, address)
         VALUES (?, ?, ?, ?, ?)`,
        [code, full_name, block_no || null, contact_no || null, address || null]
      );
      const insertResult = result as any;
      res.json({ id: insertResult.insertId });
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Beneficiary code already exists' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Create beneficiary error:', error);
    res.status(500).json({ error: 'Failed to create beneficiary' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const { code, full_name, block_no, contact_no, address, is_active } = req.body;
    const fields: string[] = [];
    const params: any[] = [];

    if (code !== undefined) { fields.push('code = ?'); params.push(code); }
    if (full_name !== undefined) { fields.push('full_name = ?'); params.push(full_name); }
    if (block_no !== undefined) { fields.push('block_no = ?'); params.push(block_no); }
    if (contact_no !== undefined) { fields.push('contact_no = ?'); params.push(contact_no); }
    if (address !== undefined) { fields.push('address = ?'); params.push(address); }
    if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    params.push(id);
    await pool.execute(`UPDATE beneficiaries SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ id });
  } catch (error) {
    console.error('Update beneficiary error:', error);
    res.status(500).json({ error: 'Failed to update beneficiary' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    await pool.execute('UPDATE beneficiaries SET is_active = 0 WHERE id = ?', [id]);
    res.json({ id, deactivated: true });
  } catch (error) {
    console.error('Delete beneficiary error:', error);
    res.status(500).json({ error: 'Failed to deactivate beneficiary' });
  }
});

export default router;
