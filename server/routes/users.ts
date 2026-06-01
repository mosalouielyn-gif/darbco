import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.full_name, u.username, u.email, r.code AS role, r.label AS role_label,
             u.is_active, u.last_login_at, u.created_at
      FROM users u JOIN roles r ON r.id = u.role_id
      ORDER BY u.full_name
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { full_name, username, email, password, role } = req.body;

    if (!full_name || !username || !email || !password || !role) {
      return res.status(400).json({ error: 'full_name, username, email, password, and role are required' });
    }

    const [roleRows] = await pool.execute('SELECT id FROM roles WHERE code = ?', [role]);
    const roles = roleRows as any[];
    if (roles.length === 0) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hash = await bcrypt.hash(password, 10);

    try {
      const [result] = await pool.execute(
        `INSERT INTO users (full_name, username, email, password_hash, role_id, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [full_name, username, email.toLowerCase(), hash, roles[0].id]
      );
      const insertResult = result as any;
      res.json({ id: insertResult.insertId });
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const { full_name, username, email, password, role, is_active } = req.body;
    const fields: string[] = [];
    const params: any[] = [];

    if (full_name !== undefined) { fields.push('full_name = ?'); params.push(full_name); }
    if (username !== undefined) { fields.push('username = ?'); params.push(username); }
    if (email !== undefined) { fields.push('email = ?'); params.push(email); }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      fields.push('password_hash = ?');
      params.push(hash);
    }

    if (role) {
      const [roleRows] = await pool.execute('SELECT id FROM roles WHERE code = ?', [role]);
      const roles = roleRows as any[];
      if (roles.length === 0) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      fields.push('role_id = ?');
      params.push(roles[0].id);
    }

    if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    params.push(id);
    await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ id });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.query.id as string);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    await pool.execute('UPDATE users SET is_active = 0 WHERE id = ?', [id]);
    res.json({ id, deactivated: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

export default router;
