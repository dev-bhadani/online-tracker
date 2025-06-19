import {Pool} from 'pg';
import {config} from './config';

const pool = new Pool({
    connectionString: config.db.url,
    ssl: {rejectUnauthorized: false},
});

export async function upsertLatestLogin(username: string, fullName: string): Promise<void> {
    await pool.query(
        `INSERT INTO user_logins (username, last_login_at, last_seen_at)
         VALUES ($1, NOW(), NOW()) ON CONFLICT (username)
     DO
        UPDATE SET
            last_seen_at = NOW(),
            last_login_at = CASE
            WHEN user_logins.last_seen_at IS NULL OR NOW() - user_logins.last_seen_at > INTERVAL '10 minutes'
            THEN NOW()
            ELSE user_logins.last_login_at
        END;`,
        [username]
    );
}

export async function startOrContinueSession(username: string) {
    const res = await pool.query(
        `SELECT 1
         FROM user_sessions
         WHERE username = $1
           AND logout_at IS NULL LIMIT 1`,
        [username]
    );
    if (res.rowCount === 0) {
        await pool.query(`INSERT INTO user_sessions (username, login_at)
                          VALUES ($1, NOW())`, [username]);
    }
}

export async function closeStaleSessions(currentOnline: string[]) {
    if (currentOnline.length === 0) return;
    const placeholders = currentOnline.map((_, i) => `$${i + 1}`).join(',');
    await pool.query(
        `UPDATE user_sessions
         SET logout_at = NOW()
         WHERE logout_at IS NULL
           AND username NOT IN (${placeholders})`,
        currentOnline
    );
}

export async function disconnectDB() {
    await pool.end();
}
