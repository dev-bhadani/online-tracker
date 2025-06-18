import { Pool } from 'pg';
import { config } from './config';

const pool = new Pool(config.db);

export async function upsertLatestLogin(username: string, fullName: string): Promise<void> {
    await pool.query(`
    INSERT INTO user_logins (username, full_name, last_login_at, last_seen_at)
    VALUES ($1, $2, NOW(), NOW())
    ON CONFLICT (username)
    DO UPDATE SET
      full_name = EXCLUDED.full_name,
      last_seen_at = NOW(),
      last_login_at = CASE
        WHEN NOW() - user_logins.last_seen_at > INTERVAL '10 minutes'
        THEN NOW()
        ELSE user_logins.last_login_at
      END;
  `, [username, fullName]);
}

export async function disconnectDB() {
    await pool.end();
}
