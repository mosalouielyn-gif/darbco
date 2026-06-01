import pg, { PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

type QueryParams = Array<string | number | boolean | null | Date>;

const postgresPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || process.env.DB_PASSWORD,
  max: 10,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
});

const toPostgresQuery = (sql: string) => {
  let index = 0;
  let converted = sql.replace(/\?/g, () => `$${++index}`);

  if (/^\s*insert\s+/i.test(converted) && !/\sreturning\s+/i.test(converted)) {
    converted = `${converted} RETURNING id`;
  }

  return converted;
};

const formatResult = (result: QueryResult) => {
  if (result.command === 'INSERT') {
    return [{ insertId: result.rows[0]?.id ?? 0, affectedRows: result.rowCount ?? 0 }];
  }

  if (result.command === 'UPDATE' || result.command === 'DELETE') {
    return [{ affectedRows: result.rowCount ?? 0 }];
  }

  return [result.rows];
};

const runQuery = async (
  runner: Pick<PoolClient, 'query'> | typeof postgresPool,
  sql: string,
  params: QueryParams = []
) => {
  const result = await runner.query(toPostgresQuery(sql), params);
  return formatResult(result);
};

const pool = {
  query: (sql: string, params: QueryParams = []) => runQuery(postgresPool, sql, params),
  execute: (sql: string, params: QueryParams = []) => runQuery(postgresPool, sql, params),
  getConnection: async () => {
    const client = await postgresPool.connect();

    return {
      beginTransaction: () => client.query('BEGIN'),
      commit: () => client.query('COMMIT'),
      rollback: () => client.query('ROLLBACK'),
      release: () => client.release(),
      query: (sql: string, params: QueryParams = []) => runQuery(client, sql, params),
      execute: (sql: string, params: QueryParams = []) => runQuery(client, sql, params),
    };
  },
};

export type InsertResult = {
  insertId: number;
  affectedRows: number;
};

export default pool;
