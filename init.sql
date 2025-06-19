CREATE TABLE IF NOT EXISTS user_logins (
                                           id SERIAL PRIMARY KEY,
                                           username TEXT UNIQUE NOT NULL,
                                           last_login_at TIMESTAMPTZ NOT NULL,
                                           last_seen_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_sessions (
                                             id SERIAL PRIMARY KEY,
                                             username TEXT NOT NULL,
                                             login_at TIMESTAMPTZ NOT NULL,
                                             logout_at TIMESTAMPTZ
);
