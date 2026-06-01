import { Router, Request, Response } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.id, i.material_id, i.item_name, c.code AS category_code, c.label AS category,
             i.unit, i.on_hand, i.unit_cost, i.expiry_date, i.stock_date, i.is_active,
             CASE
               WHEN i.on_hand <= 0 THEN 'Out of Stock'
               WHEN i.on_hand <= 20 THEN 'Low Stock'
               ELSE 'OK'
             END AS status
      FROM inventory_items i
      JOIN inventory_categories c ON c.id = i.category_id
      ORDER BY i.material_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { item_name, category_code, unit, on_hand = 0, unit_cost = 0, expiry_date, stock_date, material_id } = req.body;

    if (!item_name || !category_code || !unit) {
      return res.status(400).json({ error: 'item_name, category_code, and unit are required' });
    }

    const [catRows] = await pool.execute('SELECT id, code FROM inventory_categories WHERE code = ?', [category_code]);
    const categories = catRows as any[];
    if (categories.length === 0) {
      return res.status(400).json({ error: 'Invalid category_code' });
    }

    const category = categories[0];
    let finalMaterialId = material_id;

    if (!finalMaterialId) {
      const [countRows] = await pool.execute('SELECT COUNT(*) as count FROM inventory_items WHERE category_id = ?', [category.id]);
      const count = (countRows as any[])[0].count;
      const next = count + 1;
      finalMaterialId = `${category.code}-${String(next).padStart(3, '0')}`;
    }

    try {
      const [result] = await pool.execute(
        `INSERT INTO inventory_items
         (material_id, item_name, category_id, unit, on_hand, unit_cost, expiry_date, stock_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [finalMaterialId, item_name, category.id, unit, on_hand, unit_cost, expiry_date || null, stock_date || null]
      );
      const insertResult = result as any;
      res.json({ id: insertResult.insertId, material_id: finalMaterialId });
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Material ID already exists' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const { item_name, unit, on_hand, unit_cost, expiry_date, stock_date, category_code, is_active } = req.body;
    const fields: string[] = [];
    const params: any[] = [];

    if (item_name !== undefined) { fields.push('item_name = ?'); params.push(item_name); }
    if (unit !== undefined) { fields.push('unit = ?'); params.push(unit); }
    if (on_hand !== undefined) { fields.push('on_hand = ?'); params.push(on_hand); }
    if (unit_cost !== undefined) { fields.push('unit_cost = ?'); params.push(unit_cost); }
    if (expiry_date !== undefined) { fields.push('expiry_date = ?'); params.push(expiry_date || null); }
    if (stock_date !== undefined) { fields.push('stock_date = ?'); params.push(stock_date || null); }

    if (category_code) {
      const [catRows] = await pool.execute('SELECT id FROM inventory_categories WHERE code = ?', [category_code]);
      const categories = catRows as any[];
      if (categories.length === 0) {
        return res.status(400).json({ error: 'Invalid category_code' });
      }
      fields.push('category_id = ?');
      params.push(categories[0].id);
    }

    if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    params.push(id);
    await pool.execute(`UPDATE inventory_items SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ id });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const [checkRows] = await pool.execute('SELECT COUNT(*) as count FROM stock_transactions WHERE item_id = ?', [id]);
    const hasTxns = (checkRows as any[])[0].count > 0;

    if (hasTxns) {
      await pool.execute('UPDATE inventory_items SET is_active = 0 WHERE id = ?', [id]);
      return res.json({ id, soft_deleted: true });
    }

    await pool.execute('DELETE FROM inventory_items WHERE id = ?', [id]);
    res.json({ id, deleted: true });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

export default router;
