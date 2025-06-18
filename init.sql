CREATE TABLE IF NOT EXISTS user_logins (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    last_login_at TIMESTAMPTZ NOT NULL,
    last_seen_at TIMESTAMPTZ
);
