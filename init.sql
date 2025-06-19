CREATE TABLE IF NOT EXISTS user_logins (
                                           id SERIAL PRIMARY KEY,
                                           username TEXT UNIQUE NOT NULL,
                                           full_name TEXT,
                                           last_login_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                           last_seen_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
                                             id SERIAL PRIMARY KEY,
                                             username TEXT NOT NULL,
                                             seen_at TIMESTAMP NOT NULL DEFAULT NOW()
);
