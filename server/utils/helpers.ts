import pool from '../config/db.js';

export const audit = async (
  userId: number,
  module: string,
  action: string,
  targetType: string | null = null,
  targetId: string | null = null,
  details: string | null = null,
  ipAddress: string | null = null
) => {
  try {
    await pool.execute(
      `INSERT INTO audit_logs (user_id, module, action, target_type, target_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, module, action, targetType, targetId, details, ipAddress]
    );
  } catch (error) {
    console.error('Audit log error:', error);
  }
};
