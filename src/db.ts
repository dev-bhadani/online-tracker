import {Pool} from 'pg';
import {config} from './config';
import {DateTime} from 'luxon';

const pool = new Pool({
    connectionString: config.db.url,
    ssl: {rejectUnauthorized: false},
});

function berlinNow(): string {
    return DateTime.now().setZone('Europe/Berlin').toISO() || '';
}

export async function upsertLatestLogin(username: string, fullName: string): Promise<void> {
    const now = berlinNow();
    await pool.query(
        `INSERT INTO user_logins (username, full_name, last_login_at, last_seen_at)
         VALUES ($1, $2, $3, $3) ON CONFLICT (username)
         DO
        UPDATE SET last_seen_at = $3`,
        [username, fullName, now]
    );
}

export async function logUserSession(username: string): Promise<void> {
    const now = berlinNow();
    await pool.query(
        `INSERT INTO user_sessions (username, seen_at)
         VALUES ($1, $2)`,
        [username, now]
    );
}

export async function startOrContinueSession(username: string) {
    const now = berlinNow();
    const res = await pool.query(
        `SELECT 1
         FROM user_sessions
         WHERE username = $1
           AND logout_at IS NULL LIMIT 1`,
        [username]
    );
    if (res.rowCount === 0) {
        await pool.query(
            `INSERT INTO user_sessions (username, login_at)
             VALUES ($1, $2)`,
            [username, now]
        );
    }
}

export async function closeStaleSessions(currentOnline: string[]) {
    if (currentOnline.length === 0) return;
    const now = berlinNow();
    const placeholders = currentOnline.map((_, i) => `$${i + 1}`);
    await pool.query(
        `UPDATE user_sessions
         SET logout_at = $${placeholders.length + 1}
         WHERE logout_at IS NULL
           AND username NOT IN (${placeholders.join(',')})`,
        [...currentOnline, now]
    );
}

export async function disconnectDB() {
    await pool.end();
}
