import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { audit } from '../utils/helpers.js';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const [rows] = await pool.execute(
      `SELECT u.id, u.full_name, u.username, u.email, u.password_hash, r.code AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.email = ? AND u.is_active = 1
       LIMIT 1`,
      [normalizedEmail]
    );

    const users = rows as any[];
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await pool.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
    await audit(user.id, 'Auth', 'LOGIN', null, null, null, req.ip);

    const { password_hash, ...userData } = user;
    res.json({ user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
